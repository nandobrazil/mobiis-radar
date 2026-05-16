import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { coordsFromUf } from '../../data/brasil-uf-centers';
import { COMERCIAL_SEGMENT_PEERS_MOCK } from '../../data/comercial-segment-peers.mock';
import { BrasilApiCnpjService } from '../../shared/brasil-api-cnpj.service';
import type { BrasilApiCnpj } from '../../shared/brasil-api-cnpj.types';
import { GeoMapComponent } from '../../shared/geo-map/geo-map.component';
import type { GeoMapLegendItem, GeoMapMarker } from '../../shared/geo-map/geo-map-marker.model';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';

function formatCnpjDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '');
  if (d.length !== 14) {
    return digits;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

function formatCep(cep: string): string {
  const c = cep.replace(/\D/g, '');
  if (c.length !== 8) {
    return cep;
  }
  return `${c.slice(0, 5)}-${c.slice(5)}`;
}

@Component({
  selector: 'app-comercial-page',
  standalone: true,
  imports: [CurrencyPipe, GeoMapComponent, TopBarComponent],
  templateUrl: './comercial-page.component.html',
})
export class ComercialPageComponent {
  private readonly brasilCnpj = inject(BrasilApiCnpjService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cnpjDraft = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly empresa = signal<BrasilApiCnpj | null>(null);
  /** Lista vazia antes da busca; após busca, alvo + peers do mesmo CNAE (mock). */
  protected readonly mapMarkers = signal<GeoMapMarker[]>([]);

  protected readonly comercialMapLegend: GeoMapLegendItem[] = [
    { label: 'Empresa pesquisada', color: '#7c3aed' },
    { label: 'Mesmo CNAE (mock)', color: '#0ea5e9' },
  ];

  protected readonly formatCnpjDisplay = formatCnpjDisplay;
  protected readonly formatCep = formatCep;

  protected onCnpjInput(ev: Event): void {
    const v = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.cnpjDraft.set(v);
  }

  protected buscar(): void {
    const raw = this.cnpjDraft().trim();
    if (!raw.replace(/\D/g, '')) {
      this.error.set('Informe um CNPJ.');
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    this.brasilCnpj
      .getCnpj(raw)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => {
        this.empresa.set(data);
        this.mapMarkers.set(this.buildMapMarkers(data));
        this.loading.set(false);
      },
      error: () => {
        this.empresa.set(null);
        this.mapMarkers.set([]);
        this.error.set('Não foi possível consultar este CNPJ. Confira o número ou tente de novo.');
        this.loading.set(false);
      },
    });
  }

  private buildMapMarkers(data: BrasilApiCnpj): GeoMapMarker[] {
    const [lat0, lng0] = coordsFromUf(data.uf);
    const main: GeoMapMarker = {
      lat: lat0,
      lng: lng0,
      label: `${data.nome_fantasia?.trim() || data.razao_social} · pesquisada`,
      color: '#7c3aed',
      radius: 12,
    };

    const peers = COMERCIAL_SEGMENT_PEERS_MOCK.filter((p) => p.cnaeFiscal === data.cnae_fiscal).map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: `${p.nomeFantasia ?? p.razaoSocial} · ${p.municipio}/${p.uf}`,
      color: '#0ea5e9',
      radius: 8,
    }));

    return [main, ...peers];
  }
}
