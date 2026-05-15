import { Component } from '@angular/core';

import { kpis, portfolioHealth, productAdoption, segmentRanking } from '../data/mock-data';
import { KpiCardComponent } from '../shared/kpi-card.component';
import { BarChartComponent, DonutChartComponent, LineChartComponent } from '../shared/simple-charts.component';
import { TopBarComponent } from '../shared/top-bar.component';

@Component({
  selector: 'app-executivo-page',
  standalone: true,
  imports: [BarChartComponent, DonutChartComponent, KpiCardComponent, LineChartComponent, TopBarComponent],
  template: `
    <app-top-bar title="Visao Executiva" subtitle="Indicadores estrategicos da carteira" />
    <main class="flex-1 space-y-6 p-4 md:p-6">
      <section class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <app-kpi-card label="Churn Risk Global" [value]="churn + '%'" [delta]="-3" icon="↻" tone="danger" />
        <app-kpi-card label="Crescimento utilizacao" value="+18%" [delta]="6" icon="↗" tone="success" hint="Trimestre vs anterior" />
        <app-kpi-card label="Retencao liquida" value="112%" [delta]="4" icon="♕" tone="primary" />
        <app-kpi-card label="MRR estimado" [value]="'R$ ' + (k.mrr / 1000).toFixed(0) + 'k'" [delta]="9" icon="$" tone="success" />
      </section>

      <section class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 class="text-sm font-semibold">Adocao por produto</h3>
          <p class="text-xs text-muted-foreground">% de clientes ativos por produto</p>
          <div class="mt-4 h-[300px]">
            <app-bar-chart [data]="productAdoption" labelKey="product" valueKey="adocao" />
          </div>
        </div>
        <div class="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 class="text-sm font-semibold">Distribuicao da carteira</h3>
          <p class="text-xs text-muted-foreground">Por segmento</p>
          <div class="mt-2 h-[300px]">
            <app-donut-chart [data]="distribuicao" labelKey="name" valueKey="value" />
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 class="text-sm font-semibold">Saude da carteira x risco - 12 meses</h3>
        <p class="text-xs text-muted-foreground">Tendencia consolidada</p>
        <div class="h-[300px]">
          <app-line-chart chartId="exec" [data]="portfolioHealth" labelKey="month" [series]="series" />
        </div>
      </section>
    </main>
  `,
})
export class ExecutivoPageComponent {
  protected readonly k = kpis();
  protected readonly churn = Math.round((this.k.risco / this.k.total) * 100);
  protected readonly productAdoption = productAdoption;
  protected readonly portfolioHealth = portfolioHealth;
  protected readonly distribuicao = segmentRanking.map((segment) => ({ name: segment.segment, value: segment.clientes }));
  protected readonly series = [
    { key: 'saude', color: 'oklch(0.72 0.18 155)' },
    { key: 'atencao', color: 'oklch(0.82 0.16 90)' },
    { key: 'risco', color: 'oklch(0.62 0.24 22)' },
  ];
}
