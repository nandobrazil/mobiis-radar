import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { RelatorioTop20Item } from '../../data/top20.types';
import { RiskBadgeComponent, ScoreBarComponent } from '../../shared/risk-badge.component';
import { RadarTop20Service } from '../../shared/radar-top20.service';
import { TopBarComponent } from '../../shared/top-bar.component';
import { initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

const ALL = '__all__';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [RiskBadgeComponent, RouterLink, ScoreBarComponent, TopBarComponent],
  templateUrl: './radar-page.component.html',
})
export class RadarPageComponent implements OnInit {
  protected readonly top20 = inject(RadarTop20Service);
  protected readonly ALL = ALL;
  protected readonly q = signal('');
  protected readonly risk = signal(ALL);
  protected readonly initials = initials;

  protected readonly subtitle = computed(
    () => `${this.filtered().length} de ${this.top20.items().length} clientes filtrados`,
  );

  protected readonly filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const r = this.risk();
    return this.top20.items().filter((row) => {
      const name = row.cliente.nome_cliente.toLowerCase();
      const matchQ = !q || name.includes(q) || row.cliente.owner_id.toLowerCase().includes(q);
      const nr = row.analise.nivel_risco.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
      const matchR = r === ALL || nr === r;
      return matchQ && matchR;
    });
  });

  ngOnInit(): void {
    this.top20.load();
  }

  protected riskLevel(row: RelatorioTop20Item) {
    return nivelRiscoToRiskLevel(row.analise.nivel_risco);
  }

  /** Barra de saude operacional (inverso do score de risco da IA, 0-100). */
  protected healthScore(row: RelatorioTop20Item): number {
    return Math.max(0, Math.min(100, 100 - row.analise.score_ia));
  }
}
