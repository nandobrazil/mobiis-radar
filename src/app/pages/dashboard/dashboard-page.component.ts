import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { segmentRanking } from '../../data/mock-data';
import { GeoMapComponent } from '../../shared/geo-map.component';
import { KpiCardComponent } from '../../shared/kpi-card.component';
import { RadarTop20Service } from '../../shared/radar-top20.service';
import { RiskBadgeComponent, ScoreBarComponent } from '../../shared/risk-badge.component';
import { BarChartComponent } from '../../shared/simple-charts.component';
import { TopBarComponent } from '../../shared/top-bar.component';
import { initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    BarChartComponent,
    GeoMapComponent,
    KpiCardComponent,
    RiskBadgeComponent,
    RouterLink,
    ScoreBarComponent,
    TopBarComponent,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  protected readonly top20 = inject(RadarTop20Service);
  protected readonly initials = initials;
  /** Lista de segmentos e scores de referencia (dados demo fixos). */
  protected readonly segmentRanking = segmentRanking;

  protected readonly stats = computed(() => this.top20.stats());

  protected readonly subtitle = computed(() => {
    if (this.top20.loading() && this.top20.items().length === 0) {
      return 'Carregando relatorio Top 20...';
    }
    const n = this.stats().total;
    const t = this.top20.lastLoadedAt();
    const when = t ? ` · atualizado ${new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : '';
    return `${n} clientes prioritarios no relatorio${when}`;
  });

  ngOnInit(): void {
    if (this.top20.items().length === 0 && !this.top20.loading()) {
      this.top20.load();
    }
  }

  protected pct(count: number): string {
    const total = this.stats().total;
    if (!total) return '';
    return `${Math.round((count / total) * 100)}% da carteira`;
  }

  protected healthScore(scoreIa: number): number {
    return Math.max(0, Math.min(100, 100 - scoreIa));
  }

  protected riskLevel(nivel: string) {
    return nivelRiscoToRiskLevel(nivel);
  }
}
