import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, finalize, switchMap, throwError } from 'rxjs';

import { coordsFromUf } from '../../data/brasil-uf-centers';
import type {
  RelatorioMatchCnaeRequest,
  RelatorioMatchCnaeResponse,
} from '../../data/relatorio-match-cnae.types';
import { BrasilApiCnpjService } from '../../shared/brasil-api-cnpj.service';
import type { BrasilApiCnpj } from '../../shared/brasil-api-cnpj.types';
import { GeoMapComponent } from '../../shared/geo-map/geo-map.component';
import type { GeoMapLegendItem, GeoMapMarker } from '../../shared/geo-map/geo-map-marker.model';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { RelatorioClientesService } from '../../shared/relatorio-clientes.service';
import { RelatorioProcessamentoBannerComponent } from '../../shared/relatorio-processamento-banner/relatorio-processamento-banner.component';
import { TablePaginationBarComponent } from '../../shared/table-pagination-bar/table-pagination-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import {
  COMERCIAL_MAP_DIVISAO_COLOR,
  COMERCIAL_MAP_RISK_COLOR,
  matchCnaeToGeoMarker,
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

/** Payload da BrasilAPI repassado integralmente ao POST match-cnae. */
function brasilApiToMatchCnaePayload(data: BrasilApiCnpj): RelatorioMatchCnaeRequest {
  return { ...data };
}

@Component({
  selector: 'app-comercial-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    DataTableComponent,
    GeoMapComponent,
    RouterLink,
    TablePaginationBarComponent,
    TopBarComponent,
    RelatorioProcessamentoBannerComponent,
  ],
  templateUrl: './comercial-page.component.html',
})
export class ComercialPageComponent implements OnInit {
  private readonly brasilCnpj = inject(BrasilApiCnpjService);
  protected readonly relatorio = inject(RelatorioClientesService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly argumentoGerandoBanner = viewChild<ElementRef<HTMLElement>>('argumentoGerandoBanner');
  private readonly argumentoResultado = viewChild<ElementRef<HTMLElement>>('argumentoResultado');

  protected readonly cnpjDraft = signal('');
  protected readonly loading = signal(false);
  protected readonly matchLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly matchError = signal<string | null>(null);
  protected readonly empresa = signal<BrasilApiCnpj | null>(null);
  protected readonly matchResult = signal<RelatorioMatchCnaeResponse | null>(null);

  protected readonly matchesPage = signal(1);
  protected readonly matchesPageSize = signal(10);

  protected readonly matchMatches = computed(() => this.matchResult()?.matches ?? []);

  protected readonly matchesPageSlice = computed(() => {
    const rows = this.matchMatches();
    const size = this.matchesPageSize();
    const start = (this.matchesPage() - 1) * size;
    return rows.slice(start, start + size);
  });

  protected readonly comercialMapLegend: GeoMapLegendItem[] = [
    { label: 'CNAE exato', color: COMERCIAL_MAP_RISK_COLOR.saudavel },
    { label: 'Mesma divisão CNAE', color: COMERCIAL_MAP_DIVISAO_COLOR },
    { label: 'Risco alto', color: COMERCIAL_MAP_RISK_COLOR.risco },
    { label: 'Atenção', color: COMERCIAL_MAP_RISK_COLOR.atencao },
    { label: 'Saudável', color: COMERCIAL_MAP_RISK_COLOR.saudavel },
  ];

  protected readonly mapMarkers = computed(() => {
    const match = this.matchResult();
    if (match?.matches?.length) {
      return match.matches
        .map((row) => matchCnaeToGeoMarker(row))
        .filter((m): m is GeoMapMarker => m != null);
    }
    return this.relatorio
      .items()
      .map((row) => relatorioRowToGeoMarker(row))
      .filter((m): m is GeoMapMarker => m != null);
  });

  protected readonly mapResumo = computed(() => {
    const match = this.matchResult();
    if (match) {
      const visiveis = this.mapMarkers().length;
      const total = match.matches.length;
      const exatos = match.matches.filter((m) => m.similaridade === 'EXATO').length;
      return `${visiveis} de ${total} cliente(s) similar(es) no mapa · ${exatos} com CNAE exato`;
    }
    const total = this.relatorio.items().length;
    const visiveis = this.mapMarkers().length;
    return `${visiveis} de ${total} empresa(s) no mapa`;
  });

  protected readonly formatCnpjDisplay = formatCnpjDisplay;
  protected readonly formatCep = formatCep;

  constructor() {
    effect((onCleanup) => {
      if (!this.matchLoading()) {
        return;
      }
      const timerId = window.setTimeout(() => this.scrollPara(this.argumentoGerandoBanner), 0);
      onCleanup(() => window.clearTimeout(timerId));
    });

    effect((onCleanup) => {
      if (!this.matchResult()?.insights) {
        return;
      }
      const timerId = window.setTimeout(() => this.scrollPara(this.argumentoResultado), 0);
      onCleanup(() => window.clearTimeout(timerId));
    });

    effect(() => {
      this.matchResult();
      untracked(() => this.matchesPage.set(1));
    });

    effect(() => {
      const n = this.matchMatches().length;
      const size = this.matchesPageSize();
      const totalPages = Math.max(1, Math.ceil(n / Math.max(1, size)));
      untracked(() => {
        if (this.matchesPage() > totalPages) {
          this.matchesPage.set(totalPages);
        }
      });
    });
  }

  private scrollPara(ref: () => ElementRef<HTMLElement> | undefined): void {
    requestAnimationFrame(() => {
      ref()?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

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
    this.matchResult.set(null);
    this.error.set(null);
    this.matchError.set(null);
  }

  protected buscar(): void {
    const raw = this.cnpjDraft().trim();
    if (!raw.replace(/\D/g, '')) {
      this.error.set('Informe um CNPJ.');
      return;
    }

    this.error.set(null);
    this.matchError.set(null);
    this.matchResult.set(null);
    this.loading.set(true);
    this.matchLoading.set(false);

    this.brasilCnpj
      .getCnpj(raw)
      .pipe(
        switchMap((data) => {
          this.empresa.set(data);
          this.matchLoading.set(true);
          return this.relatorio.matchCnae(brasilApiToMatchCnaePayload(data)).pipe(
            catchError((err) => {
              this.matchError.set(
                'Não foi possível gerar o match de CNAE. Os dados cadastrais foram carregados; tente novamente.',
              );
              return throwError(() => err);
            }),
            finalize(() => this.matchLoading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (result) => {
          this.matchResult.set(result);
          this.matchError.set(null);
        },
        error: (err) => {
          if (!this.empresa()) {
            this.error.set('Não foi possível consultar este CNPJ. Confira o número ou tente de novo.');
          }
          if (err && !this.matchError()) {
            this.matchError.set('Falha ao consultar clientes similares.');
          }
        },
      });
  }

  /** Marcador do prospect quando não está entre os matches retornados. */
  protected readonly marcadorEmpresaBuscada = computed((): GeoMapMarker | null => {
    const e = this.empresa();
    if (!e) {
      return null;
    }
    const doc = e.cnpj.replace(/\D/g, '');
    const match = this.matchResult();
    if (match?.matches.some((m) => m.documento?.replace(/\D/g, '') === doc)) {
      return null;
    }
    const [lat, lng] = coordsFromUf(e.uf);
    return {
      lat,
      lng,
      label: `${e.nome_fantasia?.trim() || e.razao_social} · prospect (Brasil API)`,
      color: '#7c3aed',
      radius: 12,
    };
  });

  protected readonly mapMarkersExibidos = computed(() => {
    const extra = this.marcadorEmpresaBuscada();
    return extra ? [...this.mapMarkers(), extra] : this.mapMarkers();
  });
}
