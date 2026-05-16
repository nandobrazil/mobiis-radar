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
import {
  L,
  createMarkerClusterGroup,
  initLeafletMarkerCluster,
  isMarkerClusterAvailable,
} from './leaflet-markercluster';

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clienteDetailHashUrl(ownerId: string): string {
  return `#/cliente/${encodeURIComponent(ownerId.trim())}`;
}

@Component({
  selector: 'app-geo-map',
  standalone: true,
  templateUrl: './geo-map.component.html',
  styleUrl: './geo-map.component.css',
})
export class GeoMapComponent implements AfterViewInit, OnDestroy {
  readonly height = input(320);
  readonly markers = input<GeoMapMarker[]>([]);
  /** Agrupa pontos próximos em clusters (recomendado com muitos marcadores). */
  readonly clusterMarkers = input(true);
  /** Se omitido ou `[]`, a legenda não é exibida. */
  readonly legendItems = input<GeoMapLegendItem[] | undefined>(undefined);

  private readonly mapHost = viewChild.required<ElementRef<HTMLDivElement>>('mapHost');
  private readonly theme = inject(ThemeService);

  private readonly mapReady = signal(false);
  private map?: L.Map;
  private tileLayer?: L.TileLayer;
  private clusterGroup?: L.MarkerClusterGroup;
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
      this.clusterMarkers();
      if (this.mapReady()) {
        this.renderMarkers();
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.clusterMarkers()) {
      await initLeafletMarkerCluster();
    }

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
    if (this.clusterGroup && this.map) {
      this.map.removeLayer(this.clusterGroup);
      this.clusterGroup.clearLayers();
      this.clusterGroup = undefined;
    } else {
      for (const marker of this.leafletMarkers) {
        marker.remove();
      }
    }
    this.leafletMarkers = [];
  }

  private createCircleMarker(point: GeoMapMarker): L.CircleMarker {
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
      sticky: true,
    });

    marker.on('mouseover', () => marker.openTooltip());
    marker.on('mouseout', () => marker.closeTooltip());

    const ownerId = point.ownerId?.trim();
    if (ownerId) {
      const href = clienteDetailHashUrl(ownerId);
      const popupHtml = `<div class="geo-map-popup">
        <p class="geo-map-popup-title">${escapeHtml(point.label)}</p>
        <a href="${href}" class="geo-map-popup-link">Ver detalhes do cliente</a>
      </div>`;
      marker.bindPopup(popupHtml, { closeButton: true, maxWidth: 280, className: 'geo-map-popup-pane' });
      marker.on('click', () => marker.openPopup());
    }

    return marker;
  }

  private createClusterGroup(): L.MarkerClusterGroup {
    return createMarkerClusterGroup({
      /** Raio em px para agrupar pontos próximos na mesma tela. */
      maxClusterRadius: 56,
      /** Ao dar zoom máximo, abre em “leque” para ver cada ponto. */
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      animate: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = 'marker-cluster-small';
        if (count >= 25) {
          sizeClass = 'marker-cluster-large';
        } else if (count >= 8) {
          sizeClass = 'marker-cluster-medium';
        }
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster geo-map-cluster ${sizeClass}`,
          iconSize: L.point(40, 40),
        });
      },
    });
  }

  private fitToMarkers(points: GeoMapMarker[]): void {
    if (!this.map || points.length === 0) {
      return;
    }

    if (points.length === 1) {
      this.map.setView([points[0].lat, points[0].lng], 6);
      return;
    }

    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as L.LatLngTuple));
    if (this.clusterGroup) {
      const clusterBounds = this.clusterGroup.getBounds();
      if (clusterBounds.isValid()) {
        this.map.fitBounds(clusterBounds.pad(0.15));
        return;
      }
    }
    this.map.fitBounds(bounds.pad(0.15));
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

    const useCluster = this.clusterMarkers() && points.length > 1 && isMarkerClusterAvailable();

    if (useCluster) {
      this.clusterGroup = this.createClusterGroup();
      for (const point of points) {
        const marker = this.createCircleMarker(point);
        this.clusterGroup.addLayer(marker);
        this.leafletMarkers.push(marker);
      }
      this.map.addLayer(this.clusterGroup);
    } else {
      for (const point of points) {
        const marker = this.createCircleMarker(point);
        marker.addTo(this.map);
        this.leafletMarkers.push(marker);
      }
    }

    this.fitToMarkers(points);
  }
}
