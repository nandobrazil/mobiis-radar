import { Component, DestroyRef, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  LucideCircleDashed,
  LucideLayers,
  LucideSettings,
  LucideSparkles,
  LucideTriangleAlert,
} from '@lucide/angular';

import type { RelatorioTop20Item } from '../../data/top20.types';
import { allProducts, customers, usageSeries } from '../../data/mock-data';
import { healthScoreFromRelatorioRow, RadarTop20Service, RELATORIO_CLIENTE_DETALHE_FALLBACK_OWNER_ID } from '../../shared/radar-top20.service';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { LineChartComponent } from '../../shared/line-chart/line-chart.component';
import { ScoreBarComponent } from '../../shared/score-bar/score-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import type { ClienteContextoDto } from '../../shared/cliente-contexto.service';
import { ClienteContextoService } from '../../shared/cliente-contexto.service';
import { formatDate, initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

const CONTEXTO_AUTOR_PADRAO = 'CS';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [
    AppIconComponent,
    RiskBadgeComponent,
    RouterLink,
    TopBarComponent,
  ],
  templateUrl: './customer-detail-page.component.html',
})
export class CustomerDetailPageComponent implements OnDestroy {
  readonly id = input<string>();

  private readonly destroyRef = inject(DestroyRef);
  protected readonly top20 = inject(RadarTop20Service);
  private readonly clienteContexto = inject(ClienteContextoService);

  protected readonly contextoModalOpen = signal(false);
  protected readonly contextoLoading = signal(false);
  protected readonly contextoSaving = signal(false);
  protected readonly contextoError = signal<string | null>(null);
  protected readonly contextoDraft = signal('');
  protected readonly contextoCarregado = signal<ClienteContextoDto | null>(null);

  /** `owner_id` do cliente quando o modal esta aberto (salvar/get). */
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
    { d: '12/05', t: 'Atraso na sincronizacao ERP', dot: 'bg-warning' },
    { d: '03/05', t: 'Queda de 12% nas operacoes de roteirizacao', dot: 'bg-destructive' },
    { d: '21/04', t: 'Onboarding do produto Planner concluido', dot: 'bg-success' },
    { d: '08/04', t: 'Webhook de eventos reconfigurado', dot: 'bg-info' },
  ];

  /** `cliente/:id` ou GUID padrao (demo); usado nos GET diretos ao sem lista geral. */
  protected readonly effectiveOwnerId = computed(() => this.id()?.trim() || RELATORIO_CLIENTE_DETALHE_FALLBACK_OWNER_ID);

  protected readonly report = computed(() => {
    const row = this.top20.relatorioClienteResumo();
    return row == null ? undefined : row;
  });

  /** Detalle API so exibido quando corresponde ao cliente da rota. */
  protected readonly detalleOperacional = computed(() => {
    const d = this.top20.clienteDetalle();
    const idVal = this.effectiveOwnerId();
    if (!d || !idVal) {
      return undefined;
    }
    return d.owner_id.trim().toLowerCase() === idVal.trim().toLowerCase() ? d : undefined;
  });

  protected readonly customer = computed(() =>
    customers.find((customerItem) => customerItem.id === this.effectiveOwnerId()),
  );

  protected readonly segmentAvg = computed(() => {
    const c = this.customer();
    if (!c) return 0;
    const segmentCustomers = customers.filter((item) => item.segment === c.segment);
    return Math.round(segmentCustomers.reduce((sum, item) => sum + item.score, 0) / segmentCustomers.length);
  });

  protected readonly radarData = computed(() => {
    const c = this.customer();
    if (!c) return [];
    const segmentAvgVal = this.segmentAvg();
    return [
      { dim: 'Adocao', v: c.score, ref: segmentAvgVal },
      { dim: 'Frequencia', v: Math.min(100, c.score + 5), ref: segmentAvgVal },
      { dim: 'Engajamento', v: Math.max(0, c.score - 8), ref: segmentAvgVal - 4 },
      { dim: 'Estabilidade', v: Math.min(100, c.score + 12), ref: segmentAvgVal + 2 },
      { dim: 'Suporte', v: Math.max(0, c.score - 4), ref: segmentAvgVal + 6 },
      { dim: 'Expansao', v: c.potential === 'alto' ? 88 : c.potential === 'medio' ? 60 : 30, ref: 55 },
    ];
  });

  protected readonly unused = computed(() => {
    const c = this.customer();
    if (!c) return [];
    return allProducts.filter((product) => !c.products.includes(product)).slice(0, 4);
  });

  ngOnDestroy(): void {
    this.top20.clearClienteDetalle();
    this.top20.clearRelatorioClienteResumo();
  }

  constructor() {
    effect(() => {
      const oid = this.effectiveOwnerId();
      if (oid) {
        this.top20.fetchRelatorioClienteResumo(oid);
        this.top20.fetchClienteDetalle(oid);
      } else {
        this.top20.clearClienteDetalle();
        this.top20.clearRelatorioClienteResumo();
      }
    });
  }

  protected recarregarDetalhesClientePagina(): void {
    const oid = this.effectiveOwnerId();
    this.top20.fetchRelatorioClienteResumo(oid);
    this.top20.fetchClienteDetalle(oid);
  }

  protected riskFromReport(row: RelatorioTop20Item) {
    return nivelRiscoToRiskLevel(row.analise?.nivel_risco);
  }

  protected healthFromReport(row: RelatorioTop20Item): number {
    return healthScoreFromRelatorioRow(row);
  }

  protected kpis(row: RelatorioTop20Item) {
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

  /** GET contexto (404 tratado como “sem registro” => null). */
  private getContextoModal$(ownerId: string) {
    return this.clienteContexto.get(ownerId).pipe(
      catchError((err: unknown) => {
        const status =
          err instanceof HttpErrorResponse
            ? err.status
            : typeof err === 'object' &&
                err !== null &&
                'status' in err &&
                typeof (err as { status: unknown }).status === 'number'
              ? (err as { status: number }).status
              : NaN;
        if (status === 404) {
          return of(null);
        }
        return throwError(() => err);
      }),
    );
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
    this.contextoCarregado.set(null);
    this.contextoDraft.set('');
    this.contextoLoading.set(true);

    this.getContextoModal$(ownerId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.contextoLoading.set(false)),
      )
      .subscribe({
        next: (dto) => {
          if (dto === null) {
            this.contextoCarregado.set(null);
            this.contextoDraft.set('');
          } else {
            this.contextoCarregado.set(dto);
            this.contextoDraft.set(dto.contexto ?? '');
          }
        },
        error: () => {
          this.contextoError.set('Nao foi possivel carregar o contexto.');
        },
      });
  }

  protected fecharModalContexto(): void {
    this.contextoModalOpen.set(false);
    this.contextoOwnerId = null;
    this.contextoError.set(null);
    this.contextoLoading.set(false);
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
        tap(() => this.contextoLoading.set(true)),
        switchMap((savedDto: ClienteContextoDto) =>
          this.getContextoModal$(ownerId).pipe(
            map((fresh) => (fresh == null ? savedDto : fresh)),
            catchError(() => of(savedDto)),
          ),
        ),
        finalize(() => {
          this.contextoLoading.set(false);
          this.contextoSaving.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (dto) => {
          if (dto === null) {
            this.contextoCarregado.set(null);
            this.contextoDraft.set('');
          } else {
            this.contextoCarregado.set(dto);
            this.contextoDraft.set(dto.contexto ?? '');
          }
          this.fecharModalContexto();
        },
        error: () => {
          this.contextoError.set('Nao foi possivel salvar o contexto.');
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
