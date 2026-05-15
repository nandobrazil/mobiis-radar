import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import type { RelatorioClienteDetalle, RelatorioTop20Item } from '../data/top20.types';
import { environment } from '../../environments/environment';

export type NivelRiscoNorm = 'ALTO' | 'MEDIO' | 'BAIXO';

export interface Top20Stats {
  total: number;
  alto: number;
  medio: number;
  baixo: number;
  saudeMedia: number;
  scoreIaMedio: number;
  diasInativosMedio: number;
  acoes30dTotal: number;
  inativos30d: number;
  usuariosAtivosTotal: number;
}

export function normalizeNivelRisco(nivel: string): NivelRiscoNorm {
  const u = nivel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
  if (u === 'ALTO') return 'ALTO';
  if (u === 'MEDIO') return 'MEDIO';
  return 'BAIXO';
}

function apiRelatorioBase(): string {
  const root = environment.apiBaseUrl.replace(/\/$/, '');
  return `${root}/api/relatorio`;
}

/** Endpoint relatorio Top 20 (usa `environment.apiBaseUrl`). */
export function relatorioTop20Url(): string {
  return `${apiRelatorioBase()}/top20`;
}

export function clienteDetalleUrl(ownerId: string): string {
  return `${apiRelatorioBase()}/cliente/${encodeURIComponent(ownerId)}/detalhe`;
}

function normId(id: string): string {
  return id.trim().toLowerCase();
}

@Injectable({ providedIn: 'root' })
export class RadarTop20Service {
  private readonly http = inject(HttpClient);

  readonly items = signal<RelatorioTop20Item[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastLoadedAt = signal<number | null>(null);

  readonly clienteDetalle = signal<RelatorioClienteDetalle | null>(null);
  readonly clienteDetalleLoading = signal(false);
  readonly clienteDetalleError = signal<string | null>(null);

  private detalleFetchSeq = 0;

  readonly stats = computed((): Top20Stats => {
    const items = this.items();
    if (items.length === 0) {
      return {
        total: 0,
        alto: 0,
        medio: 0,
        baixo: 0,
        saudeMedia: 0,
        scoreIaMedio: 0,
        diasInativosMedio: 0,
        acoes30dTotal: 0,
        inativos30d: 0,
        usuariosAtivosTotal: 0,
      };
    }

    let alto = 0;
    let medio = 0;
    let baixo = 0;
    let scoreSum = 0;
    let diasSum = 0;
    let acoes30 = 0;
    let inativos30d = 0;
    let usuarios = 0;

    for (const row of items) {
      const nivel = normalizeNivelRisco(row.analise.nivel_risco);
      if (nivel === 'ALTO') alto++;
      else if (nivel === 'MEDIO') medio++;
      else baixo++;

      scoreSum += row.analise.score_ia;
      diasSum += row.cliente.dias_sem_atividade;
      acoes30 += row.cliente.acoes_30d;
      usuarios += row.cliente.usuarios_ativos;
      if (row.cliente.acoes_30d === 0) inativos30d++;
    }

    const n = items.length;
    const scoreIaMedio = Math.round(scoreSum / n);
    return {
      total: n,
      alto,
      medio,
      baixo,
      saudeMedia: Math.max(0, Math.min(100, 100 - scoreIaMedio)),
      scoreIaMedio,
      diasInativosMedio: Math.round(diasSum / n),
      acoes30dTotal: acoes30,
      inativos30d,
      usuariosAtivosTotal: usuarios,
    };
  });

  readonly riskChartData = computed(() => {
    const s = this.stats();
    return [
      { label: 'Alto', value: s.alto },
      { label: 'Medio', value: s.medio },
      { label: 'Baixo', value: s.baixo },
    ];
  });

  readonly topRisco = computed(() =>
    [...this.items()].sort((a, b) => b.analise.score_ia - a.analise.score_ia).slice(0, 6),
  );

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<RelatorioTop20Item[]>(relatorioTop20Url())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => {
          this.items.set(items ?? []);
          this.lastLoadedAt.set(Date.now());
          this.error.set(null);
        },
        error: () => {
          this.error.set('Falha ao carregar dados do radar. Verifique conexao ou CORS do servidor.');
          this.items.set([]);
        },
      });
  }

  itemByOwnerId(ownerId: string): RelatorioTop20Item | undefined {
    const n = normId(ownerId);
    return this.items().find((row) => normId(row.cliente.owner_id) === n);
  }

  fetchClienteDetalle(ownerId: string): void {
    if (!ownerId?.trim()) {
      return;
    }
    const seq = ++this.detalleFetchSeq;
    this.clienteDetalle.set(null);
    this.clienteDetalleLoading.set(true);
    this.clienteDetalleError.set(null);
    this.http
      .get<RelatorioClienteDetalle>(clienteDetalleUrl(ownerId))
      .pipe(
        finalize(() => {
          if (seq === this.detalleFetchSeq) {
            this.clienteDetalleLoading.set(false);
          }
        }),
      )
      .subscribe({
        next: (data) => {
          if (seq !== this.detalleFetchSeq) {
            return;
          }
          this.clienteDetalle.set(data);
          this.clienteDetalleError.set(null);
        },
        error: () => {
          if (seq !== this.detalleFetchSeq) {
            return;
          }
          this.clienteDetalle.set(null);
          this.clienteDetalleError.set('Nao foi possivel carregar o detalhe operacional (CORS ou rede).');
        },
      });
  }

  clearClienteDetalle(): void {
    this.detalleFetchSeq++;
    this.clienteDetalle.set(null);
    this.clienteDetalleLoading.set(false);
    this.clienteDetalleError.set(null);
  }
}
