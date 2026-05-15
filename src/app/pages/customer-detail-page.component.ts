import { Component, OnDestroy, OnInit, computed, effect, inject, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import type { RelatorioTop20Item } from '../data/top20.types';
import { allProducts, customers, usageSeries } from '../data/mock-data';
import { RiskBadgeComponent, ScoreBarComponent } from '../shared/risk-badge.component';
import { RadarTop20Service } from '../shared/radar-top20.service';
import { LineChartComponent } from '../shared/simple-charts.component';
import { TopBarComponent } from '../shared/top-bar.component';
import { formatDate, initials, nivelRiscoToRiskLevel } from '../shared/ui-helpers';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [JsonPipe, LineChartComponent, RiskBadgeComponent, RouterLink, ScoreBarComponent, TopBarComponent],
  template: `
    @if (report(); as r) {
      <app-top-bar
        [title]="r.cliente.nome_cliente"
        [subtitle]="'Score IA ' + r.analise.score_ia + ' - Risco ' + r.analise.nivel_risco"
      />
      <main class="flex-1 p-4 md:p-6">
        <div class="mb-4 flex items-center justify-between">
          <a routerLink="/radar" class="rounded-lg px-3 py-2 text-sm transition hover:bg-muted">← Voltar</a>
          <div class="flex items-center gap-2">
            <button type="button" class="btn-outline">Criar oportunidade</button>
            <button type="button" class="btn-primary">Agendar contato</button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div class="space-y-4">
            <div class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
              <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-primary opacity-15 blur-3xl"></div>
              <div class="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div class="flex items-center gap-4">
                  <div class="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-xl font-semibold text-primary-foreground shadow-elegant">
                    {{ initials(r.cliente.nome_cliente) }}
                  </div>
                  <div class="min-w-0">
                    <h2 class="text-xl font-semibold">{{ r.cliente.nome_cliente }}</h2>
                    <p class="mt-1 break-all font-mono text-xs text-muted-foreground">{{ r.cliente.owner_id }}</p>
                  </div>
                </div>
                <div class="flex shrink-0 flex-wrap items-start gap-6">
                  <div class="text-center">
                    <p class="text-[11px] uppercase tracking-wider text-muted-foreground">Saude (est.)</p>
                    <p class="text-4xl font-semibold tabular-nums text-gradient">{{ healthFromReport(r) }}</p>
                    <app-score-bar [score]="healthFromReport(r)" />
                  </div>
                  <div class="text-center">
                    <p class="text-[11px] uppercase tracking-wider text-muted-foreground">Risco</p>
                    <div class="mt-2"><app-risk-badge [risk]="riskFromReport(r)" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
              @for (kpi of kpis(r); track kpi.label) {
                <div class="rounded-xl border border-border bg-card px-4 py-3 shadow-card">
                  <p class="text-[11px] uppercase tracking-wider text-muted-foreground">{{ kpi.label }}</p>
                  <p class="mt-1 text-lg font-semibold tabular-nums">{{ kpi.value }}</p>
                </div>
              }
            </div>

            <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 class="text-sm font-semibold">Resumo</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ r.analise.resumo }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 class="text-sm font-semibold">Motivos</h3>
              <ul class="mt-3 list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                @for (m of r.analise.motivos; track $index) {
                  <li class="leading-relaxed">{{ m }}</li>
                }
              </ul>
            </div>

            <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 class="text-sm font-semibold">Risco operacional (detalhe)</h3>
                  <p class="text-xs text-muted-foreground">Uso por entidade e origem</p>
                </div>
                <div class="flex items-center gap-2">
                  @if (top20.clienteDetalleLoading()) {
                    <span class="text-xs text-muted-foreground">Carregando...</span>
                  }
                  <button
                    type="button"
                    class="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                    [disabled]="top20.clienteDetalleLoading()"
                    (click)="top20.fetchClienteDetalle(r.cliente.owner_id)"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
              @if (top20.clienteDetalleError(); as detErr) {
                <p class="text-sm text-destructive">{{ detErr }}</p>
              }
              @if (detalleOperacional(); as d) {
                <div class="mt-4 space-y-6">
                  <div class="overflow-x-auto">
                    <table class="w-full min-w-[680px] text-sm">
                      <thead class="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th class="pb-2 pr-2 font-medium">Entidade</th>
                          <th class="pb-2 pr-2 font-medium">30d</th>
                          <th class="pb-2 pr-2 font-medium">90d</th>
                          <th class="pb-2 pr-2 font-medium">Neg. 30d</th>
                          <th class="pb-2 pr-2 font-medium">Neg. 90d</th>
                          <th class="pb-2 pr-2 font-medium">Auto 30d</th>
                          <th class="pb-2 pr-2 font-medium">Usuarios</th>
                          <th class="pb-2 font-medium">Ultima acao</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-border">
                        @for (row of d.por_entidade; track row.entidade_id) {
                          <tr>
                            <td class="py-2 pr-2 font-medium">{{ row.entidade }}</td>
                            <td class="py-2 pr-2 tabular-nums text-muted-foreground">{{ row.acoes_30d }}</td>
                            <td class="py-2 pr-2 tabular-nums text-muted-foreground">{{ row.acoes_90d }}</td>
                            <td class="py-2 pr-2 tabular-nums">{{ row.negativas_30d }}</td>
                            <td class="py-2 pr-2 tabular-nums text-muted-foreground">{{ row.negativas_90d }}</td>
                            <td class="py-2 pr-2 tabular-nums text-muted-foreground">{{ row.automatizadas_30d }}</td>
                            <td class="py-2 pr-2 tabular-nums">{{ row.usuarios_distintos_30d }}</td>
                            <td class="py-2 text-xs text-muted-foreground">{{ formatIso(row.ultima_acao) }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Por origem</h4>
                    <div class="overflow-x-auto">
                      <table class="w-full max-w-xl text-sm">
                        <thead class="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th class="pb-2 pr-2 font-medium">Origem</th>
                            <th class="pb-2 pr-2 font-medium">30d</th>
                            <th class="pb-2 font-medium">90d</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-border">
                          @for (o of d.por_origem; track o.origem_id) {
                            <tr>
                              <td class="py-2 pr-2 font-medium">{{ o.origem }}</td>
                              <td class="py-2 pr-2 tabular-nums text-muted-foreground">{{ o.acoes_30d }}</td>
                              <td class="py-2 tabular-nums text-muted-foreground">{{ o.acoes_90d }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tendencia semanal</h4>
                    @if (d.tendencia_semanal.length === 0) {
                      <p class="text-sm text-muted-foreground">Nenhum dado de serie semanal disponivel.</p>
                    } @else {
                      <pre class="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed">{{ d.tendencia_semanal | json }}</pre>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <aside class="space-y-4">
            <div class="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-5 shadow-elegant">
              <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/15 to-transparent"></div>
              <div class="relative">
                <div class="flex items-center gap-2">
                  <div class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">✦</div>
                  <div>
                    <h3 class="text-sm font-semibold">Mobiis AI</h3>
                    <p class="text-[11px] text-muted-foreground">Acao recomendada</p>
                  </div>
                </div>
                <div class="mt-4 rounded-lg border border-border/50 bg-background/40 p-3 text-sm leading-relaxed">{{ r.analise.acao_recomendada }}</div>
                <button type="button" class="btn-primary mt-4 w-full">Gerar plano de acao</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    } @else if (customer(); as c) {
      <app-top-bar [title]="c.name" [subtitle]="c.segment + ' - ' + c.region" />
      <main class="flex-1 p-4 md:p-6">
        <div class="mb-4 flex items-center justify-between">
          <a routerLink="/radar" class="rounded-lg px-3 py-2 text-sm transition hover:bg-muted">← Voltar</a>
          <div class="flex items-center gap-2">
            <button class="btn-outline">Criar oportunidade</button>
            <button class="btn-primary">Agendar contato</button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div class="space-y-4">
            <div class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
              <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-primary opacity-15 blur-3xl"></div>
              <div class="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div class="flex items-center gap-4">
                  <div class="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-xl font-semibold text-primary-foreground shadow-elegant">
                    {{ initials(c.name) }}
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold">{{ c.name }}</h2>
                    <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Vendedor: {{ c.seller }}</span>
                      <span>MRR R$ {{ c.mrr.toLocaleString('pt-BR') }}</span>
                      <span>Ultima utilizacao: {{ formatDate(c.lastUse) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="text-center">
                    <p class="text-[11px] uppercase tracking-wider text-muted-foreground">Health Score</p>
                    <p class="text-4xl font-semibold tabular-nums text-gradient">{{ c.score }}</p>
                    <app-score-bar [score]="c.score" />
                  </div>
                  <div class="text-center">
                    <p class="text-[11px] uppercase tracking-wider text-muted-foreground">Risco</p>
                    <div class="mt-2"><app-risk-badge [risk]="c.risk" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 class="text-sm font-semibold">Utilizacao operacional</h3>
              <p class="text-xs text-muted-foreground">Operacoes por produto - ultimos 14 dias</p>
              <div class="h-[260px]">
                <app-line-chart chartId="usage" [data]="usageSeries" labelKey="day" [series]="usageSeriesConfig" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 class="text-sm font-semibold">Comparacao com segmento</h3>
                <p class="text-xs text-muted-foreground">{{ c.segment }} (media)</p>
                <div class="mt-4 space-y-3">
                  @for (row of radarData(); track row.dim) {
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">{{ row.dim }}</span>
                        <span>{{ row.v }} / {{ row.ref }}</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div class="h-full rounded-full bg-gradient-primary" [style.width.%]="row.v"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 class="text-sm font-semibold">Historico de incidentes</h3>
                <p class="text-xs text-muted-foreground">Ultimos 90 dias</p>
                <ul class="mt-4 space-y-3">
                  @for (incident of incidents; track incident.t) {
                    <li class="flex items-start gap-3 rounded-lg border border-border/50 bg-background/40 p-3">
                      <span class="mt-1 h-2 w-2 rounded-full" [class]="incident.dot"></span>
                      <div class="flex-1">
                        <p class="text-sm">{{ incident.t }}</p>
                        <p class="text-[11px] text-muted-foreground">{{ incident.d }}/2025</p>
                      </div>
                    </li>
                  }
                </ul>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 class="text-sm font-semibold">Produtos mais usados</h3>
                <div class="mt-3 space-y-2">
                  @for (product of c.products; track product) {
                    <div class="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2">
                      <span class="text-sm">{{ product }}</span>
                      <span class="rounded-md border border-success/30 bg-success/15 px-2 py-0.5 text-xs text-success">ativo</span>
                    </div>
                  }
                </div>
              </div>
              <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 class="text-sm font-semibold">Oportunidades de upsell</h3>
                <div class="mt-3 space-y-2">
                  @for (product of unused(); track product) {
                    <div class="flex items-center justify-between rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2">
                      <span class="text-sm">{{ product }}</span>
                      <button class="h-7 rounded px-2 text-sm text-primary hover:bg-primary/10">Sugerir ›</button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-4">
            <div class="sticky top-20 space-y-4">
              <div class="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-5 shadow-elegant">
                <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/15 to-transparent"></div>
                <div class="relative">
                  <div class="flex items-center gap-2">
                    <div class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">✦</div>
                    <div>
                      <h3 class="text-sm font-semibold">Mobiis AI Insights</h3>
                      <p class="text-[11px] text-muted-foreground">Analise gerada automaticamente</p>
                    </div>
                  </div>
                  <div class="mt-4 rounded-lg border border-border/50 bg-background/40 p-3 text-sm leading-relaxed">
                    <span class="font-medium text-gradient">{{ c.name }}</span> apresenta queda de {{ abs(c.trend) }}% na utilizacao operacional nas ultimas 4 semanas, com score abaixo da media do segmento {{ c.segment }}.
                  </div>
                  @for (section of aiSections(c); track section.title) {
                    <div class="mt-3 rounded-lg border border-border/50 bg-background/40 p-3">
                      <div class="flex items-center gap-2">
                        <span class="grid h-6 w-6 place-items-center rounded-md border" [class]="section.tone">{{ section.icon }}</span>
                        <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">{{ section.title }}</p>
                      </div>
                      <p class="mt-2 text-sm leading-relaxed" [innerHTML]="section.body"></p>
                    </div>
                  }
                  <button class="btn-primary mt-4 w-full">Gerar plano de acao</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    } @else {
      @if (!top20.loading()) {
        <app-top-bar title="Cliente nao encontrado" subtitle="Volte ao radar para selecionar outro cliente" />
        <main class="grid flex-1 place-items-center p-10 text-sm text-muted-foreground">
          Cliente nao encontrado. <a routerLink="/radar" class="ml-2 text-primary">Voltar ao radar</a>
        </main>
      } @else {
        <app-top-bar title="Carregando..." subtitle="" />
        <main class="grid flex-1 place-items-center p-10 text-sm text-muted-foreground">Carregando dados...</main>
      }
    }
  `,
})
export class CustomerDetailPageComponent implements OnInit, OnDestroy {
  readonly id = input<string>();

  protected readonly top20 = inject(RadarTop20Service);
  protected readonly customers = customers;
  protected readonly usageSeries = usageSeries;
  protected readonly initials = initials;
  protected readonly formatDate = formatDate;
  protected readonly abs = Math.abs;
  protected readonly usageSeriesConfig = [
    { key: 'rotas', color: 'oklch(0.65 0.20 255)' },
    { key: 'torre', color: 'oklch(0.65 0.22 295)' },
    { key: 'planner', color: 'oklch(0.78 0.15 200)' },
  ];
  protected readonly incidents = [
    { d: '12/05', t: 'Atraso na sincronizacao ERP', dot: 'bg-warning' },
    { d: '03/05', t: 'Queda de 12% nas operacoes de roteirizacao', dot: 'bg-destructive' },
    { d: '21/04', t: 'Onboarding do produto Planner concluido', dot: 'bg-success' },
    { d: '08/04', t: 'Webhook de eventos reconfigurado', dot: 'bg-info' },
  ];

  protected readonly report = computed(() => {
    const idVal = this.id();
    return idVal ? this.top20.itemByOwnerId(idVal) : undefined;
  });

  /** Detalle API so exibido quando corresponde ao cliente da rota. */
  protected readonly detalleOperacional = computed(() => {
    const d = this.top20.clienteDetalle();
    const idVal = this.id();
    if (!d || !idVal) {
      return undefined;
    }
    return d.owner_id.trim().toLowerCase() === idVal.trim().toLowerCase() ? d : undefined;
  });

  protected readonly customer = computed(() =>
    customers.find((customerItem) => customerItem.id === this.id()),
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

  ngOnInit(): void {
    if (this.id() && !this.top20.loading() && this.top20.items().length === 0) {
      this.top20.load();
    }
  }

  ngOnDestroy(): void {
    this.top20.clearClienteDetalle();
  }

  constructor() {
    effect(() => {
      const r = this.report();
      if (r?.cliente.owner_id) {
        this.top20.fetchClienteDetalle(r.cliente.owner_id);
      } else {
        this.top20.clearClienteDetalle();
      }
    });
  }

  protected riskFromReport(row: RelatorioTop20Item) {
    return nivelRiscoToRiskLevel(row.analise.nivel_risco);
  }

  protected healthFromReport(row: RelatorioTop20Item): number {
    return Math.max(0, Math.min(100, 100 - row.analise.score_ia));
  }

  protected kpis(row: RelatorioTop20Item) {
    const c = row.cliente;
    return [
      { label: 'Dias sem uso', value: String(c.dias_sem_atividade) },
      { label: 'Acoes 30d', value: String(c.acoes_30d) },
      { label: 'Acoes 90d', value: String(c.acoes_90d) },
      { label: 'Usuarios ativos', value: String(c.usuarios_ativos) },
      { label: 'Core 30d / 90d', value: `${c.acoes_core_30d} / ${c.acoes_core_90d}` },
      { label: 'Entidades', value: String(c.entidades_utilizadas) },
      { label: 'Acoes neg. 30d', value: String(c.acoes_negativas_30d) },
      { label: 'Automacao 30d', value: String(c.acoes_automatizadas_30d) },
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

  protected aiSections(c: { score: number; potential: string }) {
    const firstUnused = this.unused()[0] ?? 'Analytics+';
    return [
      { icon: '!', title: 'Risco de churn', tone: 'bg-destructive/10 text-destructive border-destructive/30', body: `Probabilidade estimada de <strong>${Math.max(5, 100 - c.score)}%</strong> nos proximos 60 dias.` },
      { icon: '◌', title: 'Recomendacao para CS', tone: 'bg-info/10 text-info border-info/30', body: 'Agendar QBR com sponsor + revisar SLA da Torre de Controle.' },
      { icon: '✦', title: 'Recomendacao comercial', tone: 'bg-primary/10 text-primary border-primary/30', body: `Apresentar pacote ${firstUnused} com piloto de 30 dias.` },
      { icon: '⚙', title: 'Acoes preventivas', tone: 'bg-warning/10 text-warning border-warning/30', body: 'Reativar webhook de eventos e reforcar treinamento do Planner.' },
      { icon: '↯', title: 'Produtos aderentes', tone: 'bg-primary/10 text-primary border-primary/30', body: this.unused().slice(0, 3).join(' - ') },
    ];
  }
}
