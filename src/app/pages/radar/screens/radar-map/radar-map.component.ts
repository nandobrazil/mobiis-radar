import { Component, input, computed } from '@angular/core';
import { GeoMapComponent } from "../../../../shared/geo-map/geo-map.component";
import type { GeoMapLegendItem, GeoMapMarker } from '../../../../shared/geo-map/geo-map-marker.model';
import type { RelatorioClienteItem } from '../../../../data/relatorio-clientes.types';
import { normalizeNivelRisco } from '../../../../shared/relatorio-clientes.service';

const RISK_COLOR: Record<string, string> = {
  ALTO: '#f87171',
  MEDIO: '#facc15',
  BAIXO: '#4ade80',
};

@Component({
  selector: 'app-radar-map',
  standalone: true,
  imports: [GeoMapComponent],
  template: `
    <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div class="border-b border-border px-4 py-3">
        <h2 class="text-sm font-semibold">Mapa de clientes</h2>
      </div>
      <app-geo-map [height]="600" [markers]="markers()" [legendItems]="legend" />
    </div>
  `,
})
export class RadarMapComponent {
  data = input.required<RelatorioClienteItem[]>();

  protected readonly markers = computed(() => {
    return this.data()
      .filter(row => row.cliente.lat != null && row.cliente.lng != null)
      .map(row => {
        const nr = normalizeNivelRisco(row.analise?.nivel_risco);
        return {
          lat: row.cliente.lat!,
          lng: row.cliente.lng!,
          label: row.cliente.nome_cliente,
          color: RISK_COLOR[nr],
        } as GeoMapMarker;
      });
  });

  protected readonly legend: GeoMapLegendItem[] = [
    { label: 'Saudável', color: RISK_COLOR['BAIXO'] },
    { label: 'Atenção', color: RISK_COLOR['MEDIO'] },
    { label: 'Risco', color: RISK_COLOR['ALTO'] },
  ];
}
