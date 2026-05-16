import { Component, DestroyRef, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  LucideCircleDashed,
  LucideLayers,
  LucideSettings,
  LucideSparkles,
  LucideTriangleAlert,
} from '@lucide/angular';

import type { MovideskClienteIndicadores } from '../../data/movidesk-cliente-indicadores.types';
import type { RelatorioClienteItem } from '../../data/relatorio-clientes.types';
import { allProducts, customers, usageSeries } from '../../data/mock-data';
import {
  contextoFromRelatorioRow,
  healthScoreFromRelatorioRow,
  RelatorioClientesService,
  RELATORIO_CLIENTE_DETALHE_FALLBACK_OWNER_ID,
} from '../../shared/relatorio-clientes.service';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { LineChartComponent } from '../../shared/line-chart/line-chart.component';
import { ScoreBarComponent } from '../../shared/score-bar/score-bar.component';
import { TableSkeletonComponent } from '../../shared/table-skeleton/table-skeleton.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { ClienteContextoService } from '../../shared/cliente-contexto.service';
import { formatDate, initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';
import { MovideskTicketsService } from '../../shared/movidesk-tickets.service';

const CONTEXTO_AUTOR_PADRAO = 'CS';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [
    AppIconComponent,
    RiskBadgeComponent,
    RouterLink,
    TableSkeletonComponent,
    TopBarComponent,
  ],
  templateUrl: './customer-detail-page.component.html',
})
export class CustomerDetailPageComponent implements OnDestroy {
  readonly id = input<string>();

  private readonly destroyRef = inject(DestroyRef);
  protected readonly relatorio = inject(RelatorioClientesService);
  private readonly clienteContexto = inject(ClienteContextoService);
  private readonly movideskTickets = inject(MovideskTicketsService);

  protected readonly movideskIndicadoresModalOpen = signal(false);
  protected readonly movideskIndicadoresLoading = signal(false);
  protected readonly movideskIndicadoresError = signal<string | null>(null);
  protected readonly movideskIndicadores = signal<MovideskClienteIndicadores | null>(null);

  protected readonly movideskPorCategoriaRows = computed(() => {
    const p = this.movideskIndicadores()?.por_categoria;
    if (!p) {
      return [] as { label: string; value: number }[];
    }
    return Object.entries(p).map(([label, value]) => ({ label, value }));
  });

  protected readonly contextoModalOpen = signal(false);
  protected readonly contextoSaving = signal(false);
  protected readonly contextoError = signal<string | null>(null);
  protected readonly contextoDraft = signal('');

  /** Contexto na raiz do GET `/api/relatorio/cliente/{id}`. */
  protected readonly contextoPagina = computed(() => contextoFromRelatorioRow(this.report()));

  /** `owner_id` do cliente quando o modal esta aberto (salvar). */
  private contextoOwnerId: string | null = null;
  protected readonly customers = customers;
  protected readonly usageSeries = usageSeries;
  protected readonly initials = initials;
  protected readonly formatDate = formatDate;
  protected readonly iconSparkles = LucideSparkles;
  protected readonly abs = Math.abs;
  protected readonly usageSeriesConfig = [
    { key: 'rotas', color: 'oklch(0.65 0.20 255)' },
    { key: 'torre', color: 'oklch(0.65 0.22 295)' },
    { key: 'planner', color: 'oklch(0.78 0.15 200)' },
  ];
  /** Slots para placeholders do skeleton (lista + detalhes). */
  protected readonly kpisSkeletonLabels = [0, 1, 2, 3, 4, 5, 6];
  protected readonly linhasMotivosSkeleton = [0, 1, 2, 3];
  protected readonly incidents = [
    { d: '12/05', t: 'Atraso na sincronização com o ERP', dot: 'bg-warning' },
    { d: '03/05', t: 'Queda de 12% nas operações de roteirização', dot: 'bg-destructive' },
    { d: '21/04', t: 'Onboarding do produto Planner concluido', dot: 'bg-success' },
    { d: '08/04', t: 'Webhook de eventos reconfigurado', dot: 'bg-info' },
  ];

  /** `cliente/:id` ou GUID padrao (demo); usado nos GET diretos ao sem lista geral. */
  protected readonly effectiveOwnerId = computed(() => this.id()?.trim() || RELATORIO_CLIENTE_DETALHE_FALLBACK_OWNER_ID);

  protected readonly report = computed(() => {
    const row = this.relatorio.relatorioClienteResumo();
    return row == null ? undefined : row;
  });

  /** Detalle API so exibido quando corresponde ao cliente da rota. */
  protected readonly detalleOperacional = computed(() => {
    const d = this.relatorio.clienteDetalle();
    const idVal = this.effectiveOwnerId();
    if (!d || !idVal) {
      return undefined;
    }
    return d.owner_id.trim().toLowerCase() === idVal.trim().toLowerCase() ? d : undefined;
  });

  protected readonly customer = computed(() =>
    customers.find((customerItem) => customerItem.id === this.effectiveOwnerId()),
  );

  protected readonly unused = computed(() => {
    const c = this.customer();
    if (!c) return [];
    return allProducts.filter((product) => !c.products.includes(product)).slice(0, 4);
  });

  ngOnDestroy(): void {
    this.relatorio.clearClienteDetalle();
    this.relatorio.clearRelatorioClienteResumo();
  }

  constructor() {
    effect(() => {
      const oid = this.effectiveOwnerId();
      if (oid) {
        this.relatorio.fetchRelatorioClienteResumo(oid);
        this.relatorio.fetchClienteDetalle(oid);
      } else {
        this.relatorio.clearClienteDetalle();
        this.relatorio.clearRelatorioClienteResumo();
      }
    });
  }

  protected recarregarDetalhesClientePagina(): void {
    const oid = this.effectiveOwnerId();
    this.relatorio.fetchRelatorioClienteResumo(oid);
    this.relatorio.fetchClienteDetalle(oid);
  }

  protected riskFromReport(row: RelatorioClienteItem) {
    return nivelRiscoToRiskLevel(row.analise?.nivel_risco);
  }

  protected healthFromReport(row: RelatorioClienteItem): number {
    return healthScoreFromRelatorioRow(row);
  }

  protected kpis(row: RelatorioClienteItem) {
    const c = row.cliente;
    return [
      { label: 'Dias sem uso', value: String(c.dias_sem_atividade) },
      { label: 'Ações 30d', value: String(c.acoes_30d) },
      { label: 'Ações 90d', value: String(c.acoes_90d) },
      { label: 'Usuários ativos', value: String(c.usuarios_ativos) },
      { label: 'Entidades', value: String(c.entidades_utilizadas) },
      { label: 'Ações neg. 30d', value: String(c.acoes_negativas_30d) },
      { label: 'Automação 30d', value: String(c.acoes_automatizadas_30d) },
    ];
  }

  protected formatIso(iso: string | null): string {
    if (!iso) {
      return '—';
    }
    try {
      return new Date(iso).toLocaleString('pt-BR');
    } catch {
      return iso;
    }
  }

  protected abrirModalIndicadoresMovidesk(): void {
    const row = this.report();
    const ownerId = row?.cliente.owner_id?.trim();
    if (!ownerId) {
      return;
    }
    this.movideskIndicadoresModalOpen.set(true);
    this.movideskIndicadoresLoading.set(true);
    this.movideskIndicadoresError.set(null);
    this.movideskIndicadores.set(null);

    this.movideskTickets
      .clienteIndicadores(ownerId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.movideskIndicadoresLoading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.movideskIndicadores.set(data);
        },
        error: () => {
          this.movideskIndicadoresError.set('Não foi possível carregar os indicadores Movidesk.');
        },
      });
  }

  protected fecharModalIndicadoresMovidesk(): void {
    this.movideskIndicadoresModalOpen.set(false);
    this.movideskIndicadoresLoading.set(false);
    this.movideskIndicadoresError.set(null);
    this.movideskIndicadores.set(null);
  }

  protected tendenciaMovideskLabel(t: string | undefined): string {
    const u = t?.trim().toLowerCase() ?? '';
    if (u === 'crescendo') return 'Crescendo';
    if (u === 'decrescendo' || u === 'diminuindo') return 'Em queda';
    if (u === 'estavel' || u === 'estável') return 'Estável';
    return t?.trim() || '—';
  }

  protected hasValidTendenciaDeltaPct(n: number | null | undefined): boolean {
    return n != null && !Number.isNaN(Number(n));
  }

  protected formatDeltaPct(n: number): string {
    if (n == null || Number.isNaN(n)) {
      return '—';
    }
    const sign = n > 0 ? '+' : '';
    return `${sign}${n}%`;
  }

  protected formatHorasIndicadores(h: number | null): string {
    if (h == null || Number.isNaN(Number(h))) {
      return '—';
    }
    return `${Number(h).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`;
  }

  protected abrirModalContexto(): void {
    const row = this.report();
    const ownerId = row?.cliente.owner_id?.trim();
    if (!ownerId) {
      return;
    }
    this.contextoOwnerId = ownerId;
    this.contextoModalOpen.set(true);
    this.contextoError.set(null);
    const ctx = this.contextoPagina();
    this.contextoDraft.set(ctx?.contexto ?? '');
  }

  protected fecharModalContexto(): void {
    this.contextoModalOpen.set(false);
    this.contextoOwnerId = null;
    this.contextoError.set(null);
    this.contextoSaving.set(false);
  }

  protected salvarModalContexto(): void {
    const ownerId = this.contextoOwnerId;
    if (!ownerId || this.contextoSaving()) {
      return;
    }
    this.contextoSaving.set(true);
    this.contextoError.set(null);

    this.clienteContexto
      .save(ownerId, {
        contexto: this.contextoDraft(),
        autor: CONTEXTO_AUTOR_PADRAO,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.contextoSaving.set(false)),
      )
      .subscribe({
        next: () => {
          this.fecharModalContexto();
          this.relatorio.fetchRelatorioClienteResumo(ownerId);
          this.relatorio.fetchClienteDetalle(ownerId);
        },
        error: () => {
          this.contextoError.set('Não foi possível salvar o contexto.');
        },
      });
  }

  protected aiSections(c: { score: number; potential: string }) {
    const firstUnused = this.unused()[0] ?? 'Analytics+';
    return [
      { icon: LucideTriangleAlert, title: 'Risco de churn', tone: 'bg-destructive/10 text-destructive border-destructive/30', body: `Probabilidade estimada de <strong>${Math.max(5, 100 - c.score)}%</strong> nos proximos 60 dias.` },
      { icon: LucideCircleDashed, title: 'Recomendação para CS', tone: 'bg-info/10 text-info border-info/30', body: 'Agendar QBR com sponsor + revisar SLA da Torre de Controle.' },
      { icon: LucideSparkles, title: 'Recomendação comercial', tone: 'bg-primary/10 text-primary border-primary/30', body: `Apresentar pacote ${firstUnused} com piloto de 30 dias.` },
      { icon: LucideSettings, title: 'Ações preventivas', tone: 'bg-warning/10 text-warning border-warning/30', body: 'Reativar webhook de eventos e reforcar treinamento do Planner.' },
      { icon: LucideLayers, title: 'Produtos aderentes', tone: 'bg-primary/10 text-primary border-primary/30', body: this.unused().slice(0, 3).join(' - ') },
    ];
  }
}
