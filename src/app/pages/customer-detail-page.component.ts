import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { allProducts, customers, usageSeries } from '../data/mock-data';
import { RiskBadgeComponent, ScoreBarComponent } from '../shared/risk-badge.component';
import { LineChartComponent } from '../shared/simple-charts.component';
import { TopBarComponent } from '../shared/top-bar.component';
import { formatDate, initials } from '../shared/ui-helpers';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [LineChartComponent, RiskBadgeComponent, RouterLink, ScoreBarComponent, TopBarComponent],
  template: `
    @if (customer(); as c) {
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
      <app-top-bar title="Cliente nao encontrado" subtitle="Volte ao radar para selecionar outro cliente" />
      <main class="grid flex-1 place-items-center p-10 text-sm text-muted-foreground">
        Cliente nao encontrado. <a routerLink="/radar" class="ml-2 text-primary">Voltar ao radar</a>
      </main>
    }
  `,
})
export class CustomerDetailPageComponent {
  readonly id = input<string>();
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

  protected readonly customer = computed(() => customers.find((customer) => customer.id === this.id()));

  protected readonly segmentAvg = computed(() => {
    const customer = this.customer();
    if (!customer) return 0;
    const segmentCustomers = customers.filter((item) => item.segment === customer.segment);
    return Math.round(segmentCustomers.reduce((sum, item) => sum + item.score, 0) / segmentCustomers.length);
  });

  protected readonly radarData = computed(() => {
    const customer = this.customer();
    if (!customer) return [];
    const segmentAvg = this.segmentAvg();
    return [
      { dim: 'Adocao', v: customer.score, ref: segmentAvg },
      { dim: 'Frequencia', v: Math.min(100, customer.score + 5), ref: segmentAvg },
      { dim: 'Engajamento', v: Math.max(0, customer.score - 8), ref: segmentAvg - 4 },
      { dim: 'Estabilidade', v: Math.min(100, customer.score + 12), ref: segmentAvg + 2 },
      { dim: 'Suporte', v: Math.max(0, customer.score - 4), ref: segmentAvg + 6 },
      { dim: 'Expansao', v: customer.potential === 'alto' ? 88 : customer.potential === 'medio' ? 60 : 30, ref: 55 },
    ];
  });

  protected readonly unused = computed(() => {
    const customer = this.customer();
    if (!customer) return [];
    return allProducts.filter((product) => !customer.products.includes(product)).slice(0, 4);
  });

  protected aiSections(customer: { score: number; potential: string }) {
    const firstUnused = this.unused()[0] ?? 'Analytics+';
    return [
      { icon: '!', title: 'Risco de churn', tone: 'bg-destructive/10 text-destructive border-destructive/30', body: `Probabilidade estimada de <strong>${Math.max(5, 100 - customer.score)}%</strong> nos proximos 60 dias.` },
      { icon: '◌', title: 'Recomendacao para CS', tone: 'bg-info/10 text-info border-info/30', body: 'Agendar QBR com sponsor + revisar SLA da Torre de Controle.' },
      { icon: '✦', title: 'Recomendacao comercial', tone: 'bg-primary/10 text-primary border-primary/30', body: `Apresentar pacote ${firstUnused} com piloto de 30 dias.` },
      { icon: '⚙', title: 'Acoes preventivas', tone: 'bg-warning/10 text-warning border-warning/30', body: 'Reativar webhook de eventos e reforcar treinamento do Planner.' },
      { icon: '↯', title: 'Produtos aderentes', tone: 'bg-primary/10 text-primary border-primary/30', body: this.unused().slice(0, 3).join(' - ') },
    ];
  }
}
