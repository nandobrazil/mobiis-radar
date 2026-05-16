import { Component, DestroyRef, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import type { LucideIconInput } from '@lucide/angular';
import {
  LucideActivity,
  LucideArrowLeft,
  LucideBarChart3,
  LucideBot,
  LucideCalendarClock,
  LucideCircleDashed,
  LucideFileText,
  LucideLayers,
  LucideRefreshCw,
  LucideSettings,
  LucideSparkles,
  LucideTriangleAlert,
  LucideUsers,
} from '@lucide/angular';

import type { AtendimentoClienteIndicadores } from '../../data/atendimento-cliente-indicadores.types';
import type {
  RelatorioClienteItem,
  RelatorioClienteParametros,
  RelatorioClientePorOrigem,
  RelatorioClienteScoreBreakdownItem,
} from '../../data/relatorio-clientes.types';
import { allProducts, customers, usageSeries } from '../../data/mock-data';
import {
  contextoFromRelatorioRow,
  healthScoreFromRelatorioRow,
  RelatorioClientesService,
  RELATORIO_CLIENTE_DETALHE_FALLBACK_OWNER_ID,
} from '../../shared/relatorio-clientes.service';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { KpiCardSkeletonComponent } from '../../shared/kpi-card-skeleton/kpi-card-skeleton.component';
import { LineChartComponent } from '../../shared/line-chart/line-chart.component';
import { ScoreBarComponent } from '../../shared/score-bar/score-bar.component';
import { TableSkeletonComponent } from '../../shared/table-skeleton/table-skeleton.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { ClienteContextoService } from '../../shared/cliente-contexto.service';
import { formatDate, initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';
import { AtendimentoTicketsService } from '../../shared/atendimento-tickets.service';

const CONTEXTO_AUTOR_PADRAO = 'CS';

type CustomerDetailKpiTone = 'default' | 'success' | 'warning' | 'danger' | 'primary';

interface CustomerDetailKpi {
  label: string;
  value: string | number;
  icon: LucideIconInput;
  tone: CustomerDetailKpiTone;
  hint?: string;
  delta?: number;
}

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [
    AppIconComponent,
    RiskBadgeComponent,
    RouterLink,
    KpiCardComponent,
    KpiCardSkeletonComponent,
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
  private readonly atendimentoTickets = inject(AtendimentoTicketsService);

  protected readonly atendimentoIndicadoresModalOpen = signal(false);
  protected readonly atendimentoIndicadoresLoading = signal(false);
  protected readonly atendimentoIndicadoresError = signal<string | null>(null);
  protected readonly atendimentoIndicadores = signal<AtendimentoClienteIndicadores | null>(null);

  protected readonly atendimentoPorCategoriaRows = computed(() => {
    const p = this.atendimentoIndicadores()?.por_categoria;
    if (!p) {
      return [] as { label: string; value: number }[];
    }
    return Object.entries(p).map(([label, value]) => ({ label, value }));
  });

  protected readonly contextoModalOpen = signal(false);
  protected readonly contextoSaving = signal(false);
  protected readonly contextoError = signal<string | null>(null);
  protected readonly contextoDraft = signal('');

  protected readonly planoParametrosLoading = signal(false);
  protected readonly planoParametrosError = signal<string | null>(null);
  protected readonly planoParametros = signal<RelatorioClienteParametros | null>(null);

  protected readonly reprocessarModalOpen = signal(false);
  protected readonly reprocessarLoading = signal(false);
  protected readonly reprocessarError = signal<string | null>(null);
  private reprocessarOwnerId: string | null = null;

  /** Contexto na raiz do GET `/api/relatorio/cliente/{id}`. */
  protected readonly contextoPagina = computed(() => contextoFromRelatorioRow(this.report()));

  /** `owner_id` do cliente quando o modal esta aberto (salvar). */
  private contextoOwnerId: string | null = null;
  protected readonly customers = customers;
  protected readonly usageSeries = usageSeries;
  protected readonly initials = initials;
  protected readonly formatDate = formatDate;
  protected readonly iconSparkles = LucideSparkles;
  protected readonly iconAlert = LucideTriangleAlert;
  protected readonly iconArrowLeft = LucideArrowLeft;
  protected readonly iconAtendimento = LucideBarChart3;
  protected readonly iconContexto = LucideFileText;
  protected readonly iconReprocessar = LucideRefreshCw;
  protected readonly iconActivity = LucideActivity;
  protected readonly iconLayers = LucideLayers;
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
    this.planoParametros.set(null);
    this.planoParametrosError.set(null);
    this.planoParametrosLoading.set(false);
  }

  constructor() {
    effect(() => {
      const oid = this.effectiveOwnerId();
      this.planoParametros.set(null);
      this.planoParametrosError.set(null);
      this.planoParametrosLoading.set(false);
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

  protected kpis(row: RelatorioClienteItem): CustomerDetailKpi[] {
    const c = row.cliente;
    const dias = Number(c.dias_sem_atividade) || 0;
    const acoes30 = Number(c.acoes_30d) || 0;
    const acoes90 = Number(c.acoes_90d) || 0;
    const usuarios = Number(c.usuarios_ativos) || 0;
    const entidades = Number(c.entidades_utilizadas) || 0;
    const neg30 = Number(c.acoes_negativas_30d) || 0;
    const auto30 = Number(c.acoes_automatizadas_30d) || 0;

    const taxaDiaria30 = acoes30 / 30;
    const taxaDiaria90 = acoes90 / 90;
    let deltaUso30d: number | undefined;
    if (taxaDiaria90 > 0) {
      deltaUso30d = Math.round(((taxaDiaria30 - taxaDiaria90) / taxaDiaria90) * 100);
    }

    const fmt = (n: number) => n.toLocaleString('pt-BR');
    const mediaDiaria30 = acoes30 > 0 ? `~${(taxaDiaria30).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/dia` : 'Sem ações no período';

    let diasTone: CustomerDetailKpiTone = 'success';
    let diasHint = 'Uso recente na plataforma';
    if (dias > 7) {
      diasTone = 'danger';
      diasHint = 'Inatividade prolongada — priorize reengajamento';
    } else if (dias > 0) {
      diasTone = 'warning';
      diasHint = dias === 1 ? 'Último uso há 1 dia' : `Último uso há ${dias} dias`;
    }

    let acoes30Tone: CustomerDetailKpiTone = 'default';
    if (acoes30 === 0) {
      acoes30Tone = 'danger';
    } else if (taxaDiaria90 > 0 && taxaDiaria30 < taxaDiaria90 * 0.7) {
      acoes30Tone = 'warning';
    } else if (acoes30 >= 20) {
      acoes30Tone = 'success';
    } else {
      acoes30Tone = 'primary';
    }

    const pctAuto = acoes30 > 0 ? Math.round((auto30 / acoes30) * 100) : 0;

    return [
      {
        label: 'Dias sem uso',
        value: dias,
        icon: LucideCalendarClock,
        tone: diasTone,
        hint: diasHint,
      },
      {
        label: 'Ações 30d',
        value: fmt(acoes30),
        icon: LucideActivity,
        tone: acoes30Tone,
        hint: mediaDiaria30,
        delta: deltaUso30d,
      },
      {
        label: 'Ações 90d',
        value: fmt(acoes90),
        icon: LucideBarChart3,
        tone: 'primary',
        hint: acoes90 > 0 ? `~${(taxaDiaria90).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/dia no período` : 'Histórico sem movimentação',
      },
      {
        label: 'Usuários ativos',
        value: usuarios,
        icon: LucideUsers,
        tone: usuarios === 0 ? 'warning' : usuarios >= 3 ? 'success' : 'default',
        hint: usuarios === 0 ? 'Nenhum usuário ativo no período' : usuarios === 1 ? '1 pessoa usando o produto' : `${usuarios} pessoas usando o produto`,
      },
      {
        label: 'Entidades',
        value: entidades,
        icon: LucideLayers,
        tone: entidades === 0 ? 'warning' : 'default',
        hint: entidades === 0 ? 'Nenhum módulo/entidade em uso' : 'Tipos de entidade com registro de ação',
      },
      {
        label: 'Ações neg. 30d',
        value: neg30,
        icon: LucideTriangleAlert,
        tone: neg30 === 0 ? 'success' : neg30 >= 5 ? 'danger' : 'warning',
        hint: neg30 === 0 ? 'Sem eventos negativos recentes' : 'Exclusões, erros ou fluxos revertidos',
      },
      {
        label: 'Automação 30d',
        value: fmt(auto30),
        icon: LucideBot,
        tone: auto30 === 0 ? 'warning' : 'success',
        hint: acoes30 > 0 ? `${pctAuto}% das ações 30d automatizadas` : 'Sem ações para calcular adoção técnica',
      },
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

  protected formatMetric(value: number | null | undefined): string {
    if (value == null || Number.isNaN(Number(value))) {
      return '—';
    }
    return new Intl.NumberFormat('pt-BR').format(Number(value));
  }

  protected origemShare30d(origem: RelatorioClientePorOrigem, todas: RelatorioClientePorOrigem[]): number {
    const total = todas.reduce((sum, item) => sum + (Number(item.acoes_30d) || 0), 0);
    if (total <= 0) {
      return 0;
    }
    return Math.round(((Number(origem.acoes_30d) || 0) / total) * 100);
  }

  protected negativasMetricClass(value: number): string {
    const n = Number(value) || 0;
    if (n === 0) {
      return 'text-muted-foreground';
    }
    return 'font-semibold text-destructive';
  }

  protected abrirModalIndicadoresAtendimento(): void {
    const row = this.report();
    const ownerId = row?.cliente.owner_id?.trim();
    if (!ownerId) {
      return;
    }
    this.atendimentoIndicadoresModalOpen.set(true);
    this.atendimentoIndicadoresLoading.set(true);
    this.atendimentoIndicadoresError.set(null);
    this.atendimentoIndicadores.set(null);

    this.atendimentoTickets
      .clienteIndicadores(ownerId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.atendimentoIndicadoresLoading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.atendimentoIndicadores.set(data);
        },
        error: () => {
          this.atendimentoIndicadoresError.set('Não foi possível carregar os indicadores de Atendimento.');
        },
      });
  }

  protected fecharModalIndicadoresAtendimento(): void {
    this.atendimentoIndicadoresModalOpen.set(false);
    this.atendimentoIndicadoresLoading.set(false);
    this.atendimentoIndicadoresError.set(null);
    this.atendimentoIndicadores.set(null);
  }

  protected tendenciaAtendimentoLabel(t: string | undefined): string {
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

  protected acaoRecomendadaInicial(row: RelatorioClienteItem): string {
    return row.analise?.acao_recomendada?.trim() || 'Clique em «Gerar plano de ação» para montar recomendações com base nas métricas e na IA.';
  }

  protected gerarPlanoDeAcao(ownerId: string): void {
    const oid = ownerId?.trim();
    if (!oid || this.planoParametrosLoading()) {
      return;
    }
    this.planoParametrosLoading.set(true);
    this.planoParametrosError.set(null);

    this.relatorio
      .fetchClienteParametros(oid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.planoParametrosLoading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.planoParametros.set(data ?? null);
        },
        error: () => {
          this.planoParametrosError.set('Não foi possível gerar o plano de ação. Verifique o endpoint `/parametros`.');
        },
      });
  }

  protected planoAcaoPrincipal(p: RelatorioClienteParametros): string {
    const ia = p.analise_ia;
    const texto =
      ia?.acao_recomendada?.trim() ||
      ia?.plano_acao?.trim() ||
      ia?.resumo?.trim() ||
      '';
    return texto || 'Plano gerado. Revise os alertas e os fatores do score abaixo para priorizar ações.';
  }

  protected planoBreakdownOrdenado(p: RelatorioClienteParametros): RelatorioClienteScoreBreakdownItem[] {
    const itens = p.score_breakdown ?? [];
    return [...itens].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  }

  protected formatPerfilUso(perfil: string | undefined): string {
    if (!perfil?.trim()) {
      return '—';
    }
    const labels: Record<string, string> = {
      EM_DECLINIO: 'Em declínio',
      ESTAVEL: 'Estável',
      EM_CRESCIMENTO: 'Em crescimento',
      INATIVO: 'Inativo',
      ADOCAO_INICIAL: 'Adoção inicial',
    };
    const key = perfil.trim().toUpperCase();
    return labels[key] ?? perfil.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  protected formatDeltaScore(n: number | undefined): string {
    if (n == null || Number.isNaN(Number(n))) {
      return '—';
    }
    const v = Number(n);
    const sign = v > 0 ? '+' : '';
    return `${sign}${v}`;
  }

  protected breakdownDeltaClass(delta: number): string {
    if (delta < 0) {
      return 'text-destructive';
    }
    if (delta > 0) {
      return 'text-success';
    }
    return 'text-muted-foreground';
  }

  protected alertaTipoClass(tipo: string): string {
    const u = tipo.trim().toUpperCase();
    if (u === 'CRITICO' || u === 'ALTO') {
      return 'border-destructive/40 bg-destructive/10 text-destructive';
    }
    if (u === 'ATENCAO' || u === 'MEDIO') {
      return 'border-warning/40 bg-warning/10 text-warning-foreground';
    }
    return 'border-border bg-muted/40 text-muted-foreground';
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

  protected abrirModalReprocessar(): void {
    const ownerId = this.report()?.cliente.owner_id?.trim();
    if (!ownerId) {
      return;
    }
    this.reprocessarOwnerId = ownerId;
    this.reprocessarModalOpen.set(true);
    this.reprocessarError.set(null);
  }

  protected fecharModalReprocessar(): void {
    if (this.reprocessarLoading()) {
      return;
    }
    this.reprocessarModalOpen.set(false);
    this.reprocessarOwnerId = null;
    this.reprocessarError.set(null);
  }

  protected confirmarReprocessarAnalise(): void {
    const ownerId = this.reprocessarOwnerId;
    if (!ownerId || this.reprocessarLoading()) {
      return;
    }
    this.reprocessarLoading.set(true);
    this.reprocessarError.set(null);

    this.relatorio
      .reprocessarClienteAnalise(ownerId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.reprocessarLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.reprocessarModalOpen.set(false);
          this.reprocessarOwnerId = null;
          this.planoParametros.set(null);
          this.planoParametrosError.set(null);
          this.relatorio.fetchRelatorioClienteResumo(ownerId);
        },
        error: () => {
          this.reprocessarError.set(
            'Não foi possível reprocessar a análise. Verifique o endpoint `/reprocessar` ou tente novamente.',
          );
        },
      });
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
