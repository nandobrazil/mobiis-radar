import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideActivity,
  LucideAlertCircle,
  LucideAlertTriangle,
  LucideCircleOff,
  LucideHeart,
  LucideSparkles,
  LucideUsersRound,
} from '@lucide/angular';

import type { RelatorioTop20Item } from '../../data/top20.types';
import { segmentRanking } from '../../data/mock-data';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { GeoMapComponent } from '../../shared/geo-map/geo-map.component';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { healthScoreFromRelatorioRow, RadarTop20Service } from '../../shared/radar-top20.service';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import { ScoreBarComponent } from '../../shared/score-bar/score-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    BarChartComponent,
    GeoMapComponent,
    KpiCardComponent,
    LucideActivity,
    LucideAlertTriangle,
    LucideSparkles,
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
      return 'Carregando relatorio de clientes...';
    }
    const n = this.stats().total;
    const t = this.top20.lastLoadedAt();
    const when = t ? ` · atualizado ${new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : '';
    return `${n} clientes no relatorio${when}`;
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

  protected rowHealth(row: RelatorioTop20Item): number {
    return healthScoreFromRelatorioRow(row);
  }

  protected riskLevel(nivel: string) {
    return nivelRiscoToRiskLevel(nivel);
  }

  /** Icones Lucide para KPIs e hero (evita strings nos templates). */
  protected readonly iconUsers = LucideUsersRound;
  protected readonly iconAlertHigh = LucideAlertTriangle;
  protected readonly iconAlertMed = LucideAlertCircle;
  protected readonly iconHeart = LucideHeart;
  protected readonly iconInativos = LucideCircleOff;
  protected readonly iconSparkles = LucideSparkles;
  protected readonly iconActivity = LucideActivity;
}
