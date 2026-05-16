import { Component } from '@angular/core';
import { GeoMapComponent } from "src/app/shared/geo-map/geo-map.component";
import type { GeoMapLegendItem, GeoMapMarker } from 'src/app/shared/geo-map/geo-map-marker.model';
import type { Customer } from 'src/app/data/mock-data';
import { customers } from 'src/app/data/mock-data';

const DASHBOARD_RISK_COLOR: Record<Customer['risk'], string> = {
  saudavel: '#4ade80',
  atencao: '#facc15',
  risco: '#f87171',
};

const DASHBOARD_MAP_MARKERS: GeoMapMarker[] = customers.map((c) => ({
  lat: c.lat,
  lng: c.lng,
  label: c.name,
  color: DASHBOARD_RISK_COLOR[c.risk],
}));

const DASHBOARD_MAP_LEGEND: GeoMapLegendItem[] = [
  { label: 'Saudável', color: DASHBOARD_RISK_COLOR.saudavel },
  { label: 'Atenção', color: DASHBOARD_RISK_COLOR.atencao },
  { label: 'Risco', color: DASHBOARD_RISK_COLOR.risco },
];
@Component({
  selector: 'app-radar-map',
  standalone: true,
  imports: [GeoMapComponent],
  template: `
    <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div class="border-b border-border px-4 py-3">
        <h2 class="text-sm font-semibold">Mapa de clientes</h2>
      </div>
      <app-geo-map  [height]="600" [markers]="dashboardMapMarkers" [legendItems]="dashboardMapLegend" />
    </div>
  `,
})
export class RadarMapComponent {
  protected readonly dashboardMapMarkers = DASHBOARD_MAP_MARKERS;
  protected readonly dashboardMapLegend = DASHBOARD_MAP_LEGEND;

}
