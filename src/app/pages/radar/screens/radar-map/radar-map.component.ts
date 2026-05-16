import { Component, input, computed } from '@angular/core';
import { GeoMapComponent } from "../../../../shared/geo-map/geo-map.component";
import type { GeoMapLegendItem, GeoMapMarker } from '../../../../shared/geo-map/geo-map-marker.model';
import type { RelatorioClienteItem } from '../../../../data/relatorio-clientes.types';
import { normalizeNivelRisco } from '../../../../shared/relatorio-clientes.service';
import { JsonPipe } from '@angular/common';

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
      <div class="border-b border-border px-4 py-3 flex items-center" style="height: 65px;">
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
      .map(row => {
        const owner = row.owner;
        const cliente = row.cliente;
        
        // Tenta pegar lat/lng do owner, senão do cliente
        const rawLat = owner?.lat ?? cliente?.lat;
        const rawLng = owner?.lng ?? cliente?.lng;
        
        if (rawLat == null || rawLng == null) return null;
        
        const lat = Number(rawLat);
        const lng = Number(rawLng);
        if (isNaN(lat) || isNaN(lng)) return null;

        const nome = owner?.nome || cliente?.nome_cliente || 'Cliente';
        const local = [owner?.municipio, owner?.uf].filter(Boolean).join('/');
        const label = local ? `${nome} · ${local}` : nome;

        const nr = normalizeNivelRisco(row.analise?.nivel_risco);
        const ownerId = (owner?.id || cliente?.owner_id)?.trim();
        
        return {
          lat,
          lng,
          label,
          color: RISK_COLOR[nr] || RISK_COLOR['BAIXO'],
          ownerId: ownerId || undefined,
        } as GeoMapMarker;
      })
      .filter((m): m is GeoMapMarker => m !== null);
  });

  protected readonly legend: GeoMapLegendItem[] = [
    { label: 'Saudável', color: RISK_COLOR['BAIXO'] },
    { label: 'Atenção', color: RISK_COLOR['MEDIO'] },
    { label: 'Risco', color: RISK_COLOR['ALTO'] },
  ];
}
