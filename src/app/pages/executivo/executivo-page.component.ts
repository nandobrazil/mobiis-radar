import { Component } from '@angular/core';
import { LucideCrown, LucideDollarSign, LucideRefreshCw, LucideTrendingUp } from '@lucide/angular';

import { kpis, portfolioHealth, productAdoption, segmentRanking } from '../../data/mock-data';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../../shared/donut-chart/donut-chart.component';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { LineChartComponent } from '../../shared/line-chart/line-chart.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';

@Component({
  selector: 'app-executivo-page',
  standalone: true,
  imports: [BarChartComponent, DonutChartComponent, KpiCardComponent, LineChartComponent, TopBarComponent],
  templateUrl: './executivo-page.component.html',
})
export class ExecutivoPageComponent {
  protected readonly k = kpis();
  protected readonly churn = Math.round((this.k.risco / this.k.total) * 100);
  protected readonly productAdoption = productAdoption;
  protected readonly portfolioHealth = portfolioHealth;
  protected readonly distribuicao = segmentRanking.map((segment) => ({ name: segment.segment, value: segment.clientes }));
  protected readonly iconChurn = LucideRefreshCw;
  protected readonly iconGrowth = LucideTrendingUp;
  protected readonly iconRetention = LucideCrown;
  protected readonly iconMrr = LucideDollarSign;
  protected readonly series = [
    { key: 'saude', color: 'oklch(0.72 0.18 155)' },
    { key: 'atencao', color: 'oklch(0.82 0.16 90)' },
    { key: 'risco', color: 'oklch(0.62 0.24 22)' },
  ];
}
