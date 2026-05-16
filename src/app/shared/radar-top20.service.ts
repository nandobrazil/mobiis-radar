import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import type { RelatorioClienteDetalle, RelatorioTop20Item } from '../data/top20.types';
import { environment } from '../../environments/environment';

export type NivelRiscoNorm = 'ALTO' | 'MEDIO' | 'BAIXO';

/** Agregados sobre a lista de clientes do relatorio (sem limite fixo de quantidade). */
export interface RelatorioClientesStats {
  /** Total de linhas com `cliente` (toda a lista devolvida pela API). */
  total: number;
  /** Linhas com `analise` valida (IA). */
  comAnalise: number;
  /** Linhas com `cliente` mas sem analise (ex.: `erro: true` na API). */
  semAnalise: number;
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

/** @deprecated Use `RelatorioClientesStats`. */
export type Top20Stats = RelatorioClientesStats;

export function normalizeNivelRisco(nivel: string | null | undefined): NivelRiscoNorm {
  if (nivel == null || nivel === '') {
    return 'BAIXO';
  }
  const u = nivel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
  if (u === 'ALTO') return 'ALTO';
  if (u === 'MEDIO') return 'MEDIO';
  return 'BAIXO';
}

/** True quando `analise.score_ia` e um numero utilizavel (mesma regra que medias no `stats`). */
export function hasRelatorioScoreIa(row: RelatorioTop20Item): boolean {
  const v = row.analise?.score_ia;
  if (v == null) {
    return false;
  }
  const n = Number(v);
  return !Number.isNaN(n);
}

/** Saude 0-100: usa score IA quando existe; senao heuristica operacional (dias sem uso, acoes 30d). */
export function healthScoreFromRelatorioRow(row: RelatorioTop20Item): number {
  const scoreIa = row.analise?.score_ia;
  if (hasRelatorioScoreIa(row)) {
    const n = Number(scoreIa);
    return Math.max(0, Math.min(100, Math.round(100 - n)));
  }
  const c = row.cliente;
  if (!c) {
    return 0;
  }
  let h = 100;
  h -= Math.min(55, (Number(c.dias_sem_atividade) || 0) * 0.75);
  const a30 = Number(c.acoes_30d) || 0;
  h -= Math.min(35, Math.max(0, 25 - a30) * 1.2);
  return Math.max(0, Math.min(100, Math.round(h)));
}

function apiRelatorioBase(): string {
  const root = environment.apiBaseUrl.replace(/\/$/, '');
  return `${root}/api/relatorio`;
}

/** GET lista de clientes do relatorio (`/api/relatorio/clientes`, sem limite fixo). */
export function relatorioClientesUrl(): string {
  return `${apiRelatorioBase()}/clientes`;
}

/** @deprecated Use `relatorioClientesUrl`. */
export function relatorioTop20Url(): string {
  return relatorioClientesUrl();
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

  readonly stats = computed((): RelatorioClientesStats => {
    const items = this.items();
    const comCliente = items.filter((row) => row?.cliente != null);
    const nTotal = comCliente.length;

    if (nTotal === 0) {
      return {
        total: 0,
        comAnalise: 0,
        semAnalise: 0,
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

    const comAnalise = comCliente.filter((row) => row.analise != null);
    const nIa = comAnalise.length;
    const semAnalise = nTotal - nIa;

    let alto = 0;
    let medio = 0;
    let baixo = 0;
    let scoreSum = 0;
    let diasSum = 0;
    let acoes30 = 0;
    let inativos30d = 0;
    let usuarios = 0;

    for (const row of comCliente) {
      const c = row.cliente!;
      diasSum += Number(c.dias_sem_atividade) || 0;
      acoes30 += Number(c.acoes_30d) || 0;
      usuarios += Number(c.usuarios_ativos) || 0;
      if ((Number(c.acoes_30d) || 0) === 0) inativos30d++;
    }

    for (const row of comAnalise) {
      const analise = row.analise!;
      const nivel = normalizeNivelRisco(analise.nivel_risco);
      if (nivel === 'ALTO') alto++;
      else if (nivel === 'MEDIO') medio++;
      else baixo++;
      scoreSum += Number(analise.score_ia) || 0;
    }

    const scoreIaMedio = nIa > 0 ? Math.round(scoreSum / nIa) : 0;
    let saudeMedia = 0;
    if (nIa > 0) {
      saudeMedia = Math.max(0, Math.min(100, 100 - scoreIaMedio));
    } else {
      const sumHeur = comCliente.reduce((acc, row) => acc + healthScoreFromRelatorioRow(row), 0);
      saudeMedia = Math.round(sumHeur / nTotal);
    }

    return {
      total: nTotal,
      comAnalise: nIa,
      semAnalise,
      alto,
      medio,
      baixo,
      saudeMedia,
      scoreIaMedio,
      diasInativosMedio: Math.round(diasSum / nTotal),
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
      { label: 'Sem IA', value: s.semAnalise },
    ];
  });

  /** Ate 6 clientes: prioriza score IA; se ninguem tiver IA, ordena por risco operacional (dias sem uso, acoes 30d). */
  readonly topRisco = computed(() => {
    const rows = this.items().filter((row) => row?.cliente != null);
    const comIa = rows.filter((row) => row.analise != null);
    if (comIa.length > 0) {
      return [...comIa]
        .sort((a, b) => (b.analise?.score_ia ?? 0) - (a.analise?.score_ia ?? 0))
        .slice(0, 6);
    }
    return [...rows]
      .sort((a, b) => {
        const da = a.cliente!.dias_sem_atividade ?? 0;
        const db = b.cliente!.dias_sem_atividade ?? 0;
        if (db !== da) return db - da;
        const aa = a.cliente!.acoes_30d ?? 0;
        const ab = b.cliente!.acoes_30d ?? 0;
        return aa - ab;
      })
      .slice(0, 6);
  });

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<RelatorioTop20Item[]>(relatorioClientesUrl())
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
    return this.items().find((row) => row.cliente && normId(row.cliente.owner_id) === n);
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
