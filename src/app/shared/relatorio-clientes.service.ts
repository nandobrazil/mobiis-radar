import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import type {
  RelatorioClienteDetalle,
  RelatorioClienteItem,
  RelatorioClienteParametros,
  RelatorioProcessamentoStatus,
} from '../data/relatorio-clientes.types';
import type { ClienteContextoDto } from './cliente-contexto.service';
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

/** Extrai contexto CS já presente na raiz do item do relatório. */
export function contextoFromRelatorioRow(row: RelatorioClienteItem | null | undefined): ClienteContextoDto | null {
  const ctx = row?.contexto;
  if (ctx == null) {
    return null;
  }
  const ownerId = row!.cliente?.owner_id ?? '';
  const text = (ctx.contexto ?? '').trim();
  if (!text && !ctx.autor?.trim() && !ctx.atualizado_em?.trim()) {
    return null;
  }
  return {
    owner_id: ctx.owner_id?.trim() || ownerId,
    contexto: ctx.contexto ?? '',
    autor: ctx.autor ?? '',
    atualizado_em: ctx.atualizado_em ?? '',
  };
}

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
export function hasRelatorioScoreIa(row: RelatorioClienteItem): boolean {
  const v = row.analise?.score_ia;
  if (v == null) {
    return false;
  }
  const n = Number(v);
  return !Number.isNaN(n);
}

/** Saude 0-100: usa score IA quando existe; senao heuristica operacional (dias sem uso, acoes 30d). */
export function healthScoreFromRelatorioRow(row: RelatorioClienteItem): number {
  const scoreIa = row.analise?.score_ia;
  return scoreIa ?? 0;
}

/** Maior valor = pior situação (ordenar por esta chave em ordem decrescente). */
function carteiraPioridadeRank(row: RelatorioClienteItem): number {
  if (hasRelatorioScoreIa(row)) {
    return Number(row.analise!.score_ia);
  }
  const c = row.cliente!;
  const dias = Number(c.dias_sem_atividade) || 0;
  const acoes = Number(c.acoes_30d) || 0;
  return Math.min(100, dias * 2 + Math.max(0, 40 - acoes));
}

function apiRelatorioBase(): string {
  const root = environment.apiBaseUrl.replace(/\/$/, '');
  return `${root}/api/relatorio`;
}

/** GET lista de clientes do relatorio (`/api/relatorio/clientes`). */
export function relatorioClientesUrl(): string {
  return `${apiRelatorioBase()}/clientes`;
}

/** GET status do processamento em lote da IA (`/api/relatorio/status`). */
export function relatorioStatusUrl(): string {
  return `${apiRelatorioBase()}/status`;
}

/** Intervalo de polling quando `/clientes` retorna 202. */
export const RELATORIO_STATUS_POLL_MS = 2500;

export function clienteDetalleUrl(ownerId: string): string {
  return `${apiRelatorioBase()}/cliente/${encodeURIComponent(ownerId)}/detalhe`;
}

/** GET item do relatorio (mesmo formato de `/clientes`). Usado na pagina de detalhe sem listar todos. */
export function relatorioClienteResumoUrl(ownerId: string): string {
  return `${apiRelatorioBase()}/cliente/${encodeURIComponent(ownerId.trim())}`;
}

/** GET parâmetros e plano de ação (IA + métricas derivadas). */
export function relatorioClienteParametrosUrl(ownerId: string): string {
  return `${apiRelatorioBase()}/cliente/${encodeURIComponent(ownerId.trim())}/parametros`;
}

/** POST reprocessar análise IA do cliente. */
export function relatorioClienteReprocessarUrl(ownerId: string): string {
  return `${apiRelatorioBase()}/cliente/${encodeURIComponent(ownerId.trim())}/reprocessar`;
}

/** Quando `:id` nao vem na rota, esta pagina usa este owner como padrao (demo). */
export const RELATORIO_CLIENTE_DETALHE_FALLBACK_OWNER_ID = '05B79AE8-F3BA-4830-AF86-405BE38F1B67';

function normId(id: string): string {
  return id.trim().toLowerCase();
}

@Injectable({ providedIn: 'root' })
export class RelatorioClientesService implements OnDestroy {
  private readonly http = inject(HttpClient);

  readonly items = signal<RelatorioClienteItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastLoadedAt = signal<number | null>(null);
  readonly processamentoStatus = signal<RelatorioProcessamentoStatus | null>(null);

  readonly processandoAnalise = computed(() => this.processamentoStatus()?.processando === true);

  readonly processamentoProgressoPct = computed(() => {
    const s = this.processamentoStatus();
    if (!s) {
      return 0;
    }
    if (s.chunks_total != null && s.chunks_total > 0) {
      return Math.round(((s.chunks_concluidos ?? 0) / s.chunks_total) * 100);
    }
    if (s.clientes_total != null && s.clientes_total > 0) {
      return Math.round(((s.clientes_analisados ?? 0) / s.clientes_total) * 100);
    }
    return 0;
  });

  readonly clienteDetalle = signal<RelatorioClienteDetalle | null>(null);
  readonly clienteDetalleLoading = signal(false);
  readonly clienteDetalleError = signal<string | null>(null);

  readonly relatorioClienteResumo = signal<RelatorioClienteItem | null>(null);
  readonly relatorioClienteResumoLoading = signal(false);
  readonly relatorioClienteResumoError = signal<string | null>(null);

  private detalleFetchSeq = 0;
  private resumoFetchSeq = 0;
  private loadSeq = 0;
  private pollTimeoutId: ReturnType<typeof setTimeout> | null = null;

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
      { label: 'Médio', value: s.medio },
      { label: 'Baixo', value: s.baixo },
      { label: 'Sem IA', value: s.semAnalise },
    ];
  });

  /**
   * Até 6 clientes em pior situação: maior score de risco IA quando houver análise;
   * sem IA, prioriza inatividade e poucas ações (heurística ~0–100).
   */
  readonly clientesPioresCarteira = computed(() => {
    const rows = this.items().filter((row) => row?.cliente != null);
    return [...rows].sort((a, b) => carteiraPioridadeRank(b) - carteiraPioridadeRank(a)).slice(0, 6);
  });

  ngOnDestroy(): void {
    this.stopPolling();
  }

  load(): void {
    this.stopPolling();
    const seq = ++this.loadSeq;
    this.fetchClientes(seq);
  }

  private stopPolling(): void {
    if (this.pollTimeoutId != null) {
      clearTimeout(this.pollTimeoutId);
      this.pollTimeoutId = null;
    }
  }

  private schedulePoll(seq: number): void {
    this.stopPolling();
    this.pollTimeoutId = setTimeout(() => this.pollStatus(seq), RELATORIO_STATUS_POLL_MS);
  }

  private onProcessamentoEmAndamento(status: RelatorioProcessamentoStatus, seq: number): void {
    if (seq !== this.loadSeq) {
      return;
    }
    this.processamentoStatus.set(status);
    if (status.processando) {
      this.schedulePoll(seq);
    } else {
      this.fetchClientes(seq);
    }
  }

  private pollStatus(seq: number): void {
    this.http.get<RelatorioProcessamentoStatus>(relatorioStatusUrl()).subscribe({
      next: (status) => {
        if (seq !== this.loadSeq) {
          return;
        }
        this.processamentoStatus.set(status);
        if (status.processando) {
          this.schedulePoll(seq);
        } else {
          this.stopPolling();
          this.fetchClientes(seq);
        }
      },
      error: () => {
        if (seq !== this.loadSeq) {
          return;
        }
        this.schedulePoll(seq);
      },
    });
  }

  private fetchClientes(seq: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<RelatorioClienteItem[]>(relatorioClientesUrl(), { observe: 'response' })
      .pipe(
        finalize(() => {
          if (seq === this.loadSeq && !this.processandoAnalise()) {
            this.loading.set(false);
          }
        }),
      )
      .subscribe({
        next: (res: HttpResponse<RelatorioClienteItem[]>) => {
          if (seq !== this.loadSeq) {
            return;
          }
          if (res.status === 202) {
            this.items.set([]);
            const status = res.body as unknown as RelatorioProcessamentoStatus;
            if (status && typeof status === 'object') {
              this.onProcessamentoEmAndamento(status, seq);
            } else {
              this.pollStatus(seq);
            }
            return;
          }
          if (res.status === 200 && Array.isArray(res.body)) {
            this.processamentoStatus.set(null);
            this.stopPolling();
            this.items.set(res.body);
            this.lastLoadedAt.set(Date.now());
            this.error.set(null);
            this.loading.set(false);
          }
        },
        error: () => {
          if (seq !== this.loadSeq) {
            return;
          }
          this.stopPolling();
          this.processamentoStatus.set(null);
          this.loading.set(false);
          this.error.set('Falha ao carregar clientes do relatório. Verifique conexão ou CORS do servidor.');
          this.items.set([]);
        },
      });
  }

  itemByOwnerId(ownerId: string): RelatorioClienteItem | undefined {
    const n = normId(ownerId);
    return this.items().find((row) => row.cliente && normId(row.cliente.owner_id) === n);
  }

  fetchRelatorioClienteResumo(ownerId: string): void {
    const oid = ownerId?.trim();
    if (!oid) {
      return;
    }
    const seq = ++this.resumoFetchSeq;
    this.relatorioClienteResumo.set(null);
    this.relatorioClienteResumoLoading.set(true);
    this.relatorioClienteResumoError.set(null);
    this.http
      .get<RelatorioClienteItem>(relatorioClienteResumoUrl(oid))
      .pipe(
        finalize(() => {
          if (seq === this.resumoFetchSeq) {
            this.relatorioClienteResumoLoading.set(false);
          }
        }),
      )
      .subscribe({
        next: (row) => {
          if (seq !== this.resumoFetchSeq) {
            return;
          }
          this.relatorioClienteResumo.set(row ?? null);
          this.relatorioClienteResumoError.set(null);
        },
        error: () => {
          if (seq !== this.resumoFetchSeq) {
            return;
          }
          this.relatorioClienteResumo.set(null);
          this.relatorioClienteResumoError.set(
            'Não foi possível carregar os dados deste cliente. Verifique o endpoint `/api/relatorio/cliente/{id}` ou a rede.',
          );
        },
      });
  }

  clearRelatorioClienteResumo(): void {
    this.resumoFetchSeq++;
    this.relatorioClienteResumo.set(null);
    this.relatorioClienteResumoLoading.set(false);
    this.relatorioClienteResumoError.set(null);
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
          this.clienteDetalleError.set('Não foi possível carregar o detalhe operacional (CORS ou rede).');
        },
      });
  }

  clearClienteDetalle(): void {
    this.detalleFetchSeq++;
    this.clienteDetalle.set(null);
    this.clienteDetalleLoading.set(false);
    this.clienteDetalleError.set(null);
  }

  fetchClienteParametros(ownerId: string) {
    const oid = ownerId?.trim();
    if (!oid) {
      throw new Error('owner_id obrigatório');
    }
    return this.http.get<RelatorioClienteParametros>(relatorioClienteParametrosUrl(oid));
  }

  reprocessarClienteAnalise(ownerId: string) {
    const oid = ownerId?.trim();
    if (!oid) {
      throw new Error('owner_id obrigatório');
    }
    return this.http.post<RelatorioClienteItem>(relatorioClienteReprocessarUrl(oid), {});
  }
}
