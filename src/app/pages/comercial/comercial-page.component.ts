import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { coordsFromUf } from '../../data/brasil-uf-centers';
import { BrasilApiCnpjService } from '../../shared/brasil-api-cnpj.service';
import type { BrasilApiCnpj } from '../../shared/brasil-api-cnpj.types';
import { GeoMapComponent } from '../../shared/geo-map/geo-map.component';
import type { GeoMapLegendItem, GeoMapMarker } from '../../shared/geo-map/geo-map-marker.model';
import { RelatorioClientesService } from '../../shared/relatorio-clientes.service';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import {
  COMERCIAL_MAP_RISK_COLOR,
  filterRelatorioPorCnaeDescricao,
  relatorioRowToGeoMarker,
} from './comercial-mapa.helpers';

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
export class ComercialPageComponent implements OnInit {
  private readonly brasilCnpj = inject(BrasilApiCnpjService);
  protected readonly relatorio = inject(RelatorioClientesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cnpjDraft = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly empresa = signal<BrasilApiCnpj | null>(null);
  /** Quando definido, o mapa mostra só empresas com o mesmo `cnae_fiscal_descricao`. */
  protected readonly cnaeFiltroDescricao = signal<string | null>(null);

  protected readonly comercialMapLegend: GeoMapLegendItem[] = [
    { label: 'Risco alto', color: COMERCIAL_MAP_RISK_COLOR.risco },
    { label: 'Atenção', color: COMERCIAL_MAP_RISK_COLOR.atencao },
    { label: 'Saudável', color: COMERCIAL_MAP_RISK_COLOR.saudavel },
  ];

  protected readonly mapMarkers = computed(() => {
    const rows = filterRelatorioPorCnaeDescricao(this.relatorio.items(), this.cnaeFiltroDescricao());
    return rows
      .map((row) => relatorioRowToGeoMarker(row))
      .filter((m): m is GeoMapMarker => m != null);
  });

  protected readonly mapResumo = computed(() => {
    const total = this.relatorio.items().length;
    const visiveis = this.mapMarkers().length;
    const filtro = this.cnaeFiltroDescricao();
    if (filtro?.trim()) {
      return `${visiveis} empresa(s) com o mesmo CNAE no mapa`;
    }
    return `${visiveis} de ${total} empresa(s) no mapa`;
  });

  protected readonly formatCnpjDisplay = formatCnpjDisplay;
  protected readonly formatCep = formatCep;

  ngOnInit(): void {
    if (this.relatorio.items().length === 0 && !this.relatorio.loading()) {
      this.relatorio.load();
    }
  }

  protected onCnpjInput(ev: Event): void {
    const v = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.cnpjDraft.set(v);
  }

  protected limparBusca(): void {
    this.cnpjDraft.set('');
    this.empresa.set(null);
    this.cnaeFiltroDescricao.set(null);
    this.error.set(null);
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
          this.cnaeFiltroDescricao.set(data.cnae_fiscal_descricao?.trim() || null);
          this.loading.set(false);
        },
        error: () => {
          this.empresa.set(null);
          this.cnaeFiltroDescricao.set(null);
          this.error.set('Não foi possível consultar este CNPJ. Confira o número ou tente de novo.');
          this.loading.set(false);
        },
      });
  }

  /** Marcador extra quando o CNPJ buscado não está na lista do relatório. */
  protected readonly marcadorEmpresaBuscada = computed((): GeoMapMarker | null => {
    const e = this.empresa();
    if (!e) {
      return null;
    }
    const doc = e.cnpj.replace(/\D/g, '');
    const jaNaLista = this.relatorio.items().some(
      (row) => row.owner?.documento?.replace(/\D/g, '') === doc,
    );
    if (jaNaLista) {
      return null;
    }
    const [lat, lng] = coordsFromUf(e.uf);
    return {
      lat,
      lng,
      label: `${e.nome_fantasia?.trim() || e.razao_social} · pesquisada (Brasil API)`,
      color: '#7c3aed',
      radius: 12,
    };
  });

  protected readonly mapMarkersExibidos = computed(() => {
    const extra = this.marcadorEmpresaBuscada();
    return extra ? [...this.mapMarkers(), extra] : this.mapMarkers();
  });
}
