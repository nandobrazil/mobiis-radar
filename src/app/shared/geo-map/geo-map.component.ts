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

import {
  GEO_MAP_DEFAULT_MARKER_COLOR,
  GEO_MAP_DEFAULT_RADIUS,
  type GeoMapLegendItem,
  type GeoMapMarker,
} from './geo-map-marker.model';
import { ThemeService } from '../theme.service';

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const TILE_LAYERS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

const BRAZIL_OVERVIEW: L.LatLngTuple = [-14.2, -51.9];

@Component({
  selector: 'app-geo-map',
  standalone: true,
  templateUrl: './geo-map.component.html',
  styleUrl: './geo-map.component.css',
})
export class GeoMapComponent implements AfterViewInit, OnDestroy {
  readonly height = input(320);
  readonly markers = input<GeoMapMarker[]>([]);
  /** Se omitido ou `[]`, a legenda não é exibida. */
  readonly legendItems = input<GeoMapLegendItem[] | undefined>(undefined);

  private readonly mapHost = viewChild.required<ElementRef<HTMLDivElement>>('mapHost');
  private readonly theme = inject(ThemeService);

  private readonly mapReady = signal(false);
  private map?: L.Map;
  private tileLayer?: L.TileLayer;
  private leafletMarkers: L.CircleMarker[] = [];

  constructor() {
    effect(() => {
      this.theme.mode();
      if (this.mapReady()) {
        this.syncTileLayer();
      }
    });

    effect(() => {
      this.markers();
      if (this.mapReady()) {
        this.renderMarkers();
      }
    });
  }

  ngAfterViewInit(): void {
    const el = this.mapHost().nativeElement;

    this.map = L.map(el, {
      center: BRAZIL_OVERVIEW,
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    this.syncTileLayer();
    this.renderMarkers();

    this.mapReady.set(true);
    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    this.mapReady.set(false);
    this.clearMarkers();
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

  private clearMarkers(): void {
    for (const marker of this.leafletMarkers) {
      marker.remove();
    }
    this.leafletMarkers = [];
  }

  private renderMarkers(): void {
    if (!this.map) {
      return;
    }

    this.clearMarkers();

    const points = this.markers();

    if (points.length === 0) {
      this.map.setView(BRAZIL_OVERVIEW, 4);
      return;
    }

    for (const point of points) {
      const fill = point.color ?? GEO_MAP_DEFAULT_MARKER_COLOR;
      const r = point.radius ?? GEO_MAP_DEFAULT_RADIUS;

      const marker = L.circleMarker([point.lat, point.lng], {
        radius: r,
        fillColor: fill,
        color: '#ffffffb3',
        weight: 1.5,
        fillOpacity: 0.92,
      });

      marker.bindTooltip(point.label, {
        direction: 'top',
        offset: L.point(0, -10),
        opacity: 1,
      });

      marker.on('mouseover', () => marker.openTooltip());
      marker.on('mouseout', () => marker.closeTooltip());

      marker.addTo(this.map);
      this.leafletMarkers.push(marker);
    }

    if (points.length === 1) {
      this.map.setView([points[0].lat, points[0].lng], 6);
      return;
    }

    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as L.LatLngTuple));
    this.map.fitBounds(bounds.pad(0.15));
  }
}
