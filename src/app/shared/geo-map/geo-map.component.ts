import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';

import { Customer, customers } from '../../data/mock-data';
import { ThemeService } from '../theme.service';

const RISK_COLORS: Record<Customer['risk'], string> = {
  saudavel: '#4ade80',
  atencao: '#facc15',
  risco: '#f87171',
};

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const TILE_LAYERS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

@Component({
  selector: 'app-geo-map',
  standalone: true,
  templateUrl: './geo-map.component.html',
  styleUrl: './geo-map.component.css',
})
export class GeoMapComponent implements AfterViewInit, OnDestroy {
  readonly height = input(320);
  private readonly mapHost = viewChild.required<ElementRef<HTMLDivElement>>('mapHost');
  private readonly theme = inject(ThemeService);

  private readonly mapReady = signal(false);
  private map?: L.Map;
  private tileLayer?: L.TileLayer;
  private markers: L.CircleMarker[] = [];

  constructor() {
    effect(() => {
      this.theme.mode();
      if (this.mapReady()) {
        this.syncTileLayer();
      }
    });
  }

  ngAfterViewInit(): void {
    const el = this.mapHost().nativeElement;

    this.map = L.map(el, {
      center: [-14.2, -51.9],
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    this.syncTileLayer();

    for (const customer of customers) {
      const marker = L.circleMarker([customer.lat, customer.lng], {
        radius: 8,
        fillColor: RISK_COLORS[customer.risk],
        color: '#ffffffb3',
        weight: 1.5,
        fillOpacity: 0.92,
      });

      marker.bindTooltip(customer.name, {
        direction: 'top',
        offset: L.point(0, -10),
        opacity: 1,
      });

      marker.on('mouseover', () => marker.openTooltip());
      marker.on('mouseout', () => marker.closeTooltip());

      marker.addTo(this.map);
      this.markers.push(marker);
    }

    const bounds = L.latLngBounds(customers.map((c) => [c.lat, c.lng] as L.LatLngTuple));
    this.map.fitBounds(bounds.pad(0.12));

    this.mapReady.set(true);

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    this.mapReady.set(false);
    this.markers = [];
    this.tileLayer = undefined;
    this.map?.remove();
    this.map = undefined;
  }

  private isDarkTheme(): boolean {
    return this.theme.mode() === 'dark';
  }

  private syncTileLayer(): void {
    if (!this.map) {
      return;
    }

    const url = this.isDarkTheme() ? TILE_LAYERS.dark : TILE_LAYERS.light;

    if (this.tileLayer) {
      this.tileLayer.setUrl(url);
      return;
    }

    this.tileLayer = L.tileLayer(url, {
      attribution: TILE_ATTRIBUTION,
      subdomains: 'abcd',
      maxZoom: 19,
    });

    this.tileLayer.addTo(this.map);
  }
}
