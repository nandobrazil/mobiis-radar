import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { customers, kpis, portfolioHealth, segmentRanking } from '../data/mock-data';
import { GeoMapComponent } from '../shared/geo-map.component';
import { KpiCardComponent } from '../shared/kpi-card.component';
import { RiskBadgeComponent, ScoreBarComponent } from '../shared/risk-badge.component';
import { LineChartComponent } from '../shared/simple-charts.component';
import { TopBarComponent } from '../shared/top-bar.component';
import { initials } from '../shared/ui-helpers';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [GeoMapComponent, KpiCardComponent, LineChartComponent, RiskBadgeComponent, RouterLink, ScoreBarComponent, TopBarComponent],
  template: `
    <app-top-bar title="Dashboard Estrategico" subtitle="Visao consolidada da carteira em tempo real" />
    <main class="flex-1 space-y-6 p-4 md:p-6">
      <section class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
        <div class="absolute inset-0 bg-grid opacity-40"></div>
        <div class="absolute -top-24 right-0 h-64 w-[480px] rounded-full bg-gradient-primary opacity-20 blur-3xl"></div>
        <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              ✦ Mobiis AI Insights ativo
            </span>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Sua carteira esta <span class="text-gradient">{{ k.scoreMedio }}% saudavel</span>
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ k.risco }} clientes em risco critico - {{ k.oportunidades }} oportunidades comerciais identificadas
            </p>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
            <div class="grid h-10 w-10 place-items-center rounded-lg bg-success/15 text-success">↗</div>
            <div class="leading-tight">
              <p class="text-xs text-muted-foreground">MRR estimado</p>
              <p class="text-lg font-semibold tabular-nums">R$ {{ (k.mrr / 1000).toFixed(0) }}k</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <app-kpi-card label="Clientes monitorados" [value]="k.total" [delta]="8" icon="◉" tone="primary" />
        <app-kpi-card label="Saudaveis" [value]="k.saudaveis" [delta]="5" icon="♡" tone="success" />
        <app-kpi-card label="Em atencao" [value]="k.atencao" [delta]="-2" icon="⌁" tone="warning" />
        <app-kpi-card label="Em risco" [value]="k.risco" [delta]="-12" icon="!" tone="danger" />
        <app-kpi-card label="Oportunidades" [value]="k.oportunidades" [delta]="14" icon="✦" tone="primary" />
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold">Evolucao da saude da carteira</h3>
              <p class="text-xs text-muted-foreground">Ultimos 12 meses</p>
            </div>
            <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-success"></span>Saudaveis</span>
              <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-warning"></span>Atencao</span>
              <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-destructive"></span>Risco</span>
            </div>
          </div>
          <div class="h-[280px]">
            <app-line-chart
              chartId="portfolio"
              [data]="portfolioHealth"
              labelKey="month"
              [series]="portfolioSeries"
            />
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div class="mb-3">
            <h3 class="text-sm font-semibold">Mapa de clientes</h3>
            <p class="text-xs text-muted-foreground">Distribuicao geografica</p>
          </div>
          <app-geo-map [height]="300" />
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 class="text-sm font-semibold">Segmentos mais saudaveis</h3>
          <p class="text-xs text-muted-foreground">Score medio por vertical</p>
          <div class="mt-4 space-y-3">
            @for (segment of segmentRanking; track segment.segment; let i = $index) {
              <div class="flex items-center gap-3">
                <span class="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-xs font-semibold text-muted-foreground">{{ i + 1 }}</span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ segment.segment }}</span>
                    <span class="text-xs text-muted-foreground">{{ segment.clientes }} clientes</span>
                  </div>
                  <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div class="h-full rounded-full bg-gradient-primary" [style.width.%]="segment.score"></div>
                  </div>
                </div>
                <span class="w-10 text-right text-sm font-semibold tabular-nums">{{ segment.score }}</span>
              </div>
            }
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 class="text-sm font-semibold">Clientes com maior risco</h3>
          <p class="text-xs text-muted-foreground">Recomenda-se acao imediata do CS</p>
          <div class="mt-4 divide-y divide-border">
            @for (customer of topRisco; track customer.id) {
              <a
                [routerLink]="['/cliente', customer.id]"
                class="flex items-center gap-3 rounded-md px-1 py-2.5 transition-colors hover:bg-muted/30"
              >
                <div class="grid h-9 w-9 place-items-center rounded-lg bg-accent text-xs font-semibold">{{ initials(customer.name) }}</div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">{{ customer.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ customer.segment }} - {{ customer.region }}</p>
                </div>
                <app-score-bar [score]="customer.score" />
                <app-risk-badge [risk]="customer.risk" />
              </a>
            }
          </div>
        </div>
      </section>
    </main>
  `,
})
export class DashboardPageComponent {
  protected readonly k = kpis();
  protected readonly customers = customers;
  protected readonly portfolioHealth = portfolioHealth;
  protected readonly segmentRanking = segmentRanking;
  protected readonly topRisco = [...customers].sort((a, b) => a.score - b.score).slice(0, 6);
  protected readonly initials = initials;
  protected readonly portfolioSeries = [
    { key: 'saude', color: 'oklch(0.72 0.18 155)' },
    { key: 'atencao', color: 'oklch(0.82 0.16 90)' },
    { key: 'risco', color: 'oklch(0.62 0.24 22)' },
  ];
}
