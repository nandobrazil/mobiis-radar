import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { RelatorioClienteItem } from '../../data/relatorio-clientes.types';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { TableSkeletonComponent } from '../../shared/table-skeleton/table-skeleton.component';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import {
  hasRelatorioScoreIa,
  healthScoreFromRelatorioRow,
  normalizeNivelRisco,
  RelatorioClientesService,
} from '../../shared/relatorio-clientes.service';
import { ScoreBarComponent } from '../../shared/score-bar/score-bar.component';
import { TablePaginationBarComponent } from '../../shared/table-pagination-bar/table-pagination-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { LucideSearch } from '@lucide/angular';
import { initials, iaRiskCaptionClass, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

const ALL = '__all__';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [AppIconComponent, DataTableComponent, TableSkeletonComponent, RiskBadgeComponent, RouterLink, ScoreBarComponent, TablePaginationBarComponent, TopBarComponent],
  templateUrl: './radar-page.component.html',
})
export class RadarPageComponent implements OnInit {
  protected readonly relatorio = inject(RelatorioClientesService);
  protected readonly iconSearch = LucideSearch;
  protected readonly ALL = ALL;
  protected readonly q = signal('');
  protected readonly risk = signal(ALL);
  protected readonly initials = initials;

  /** Paginação somente no front (sobre `filtered()`). */
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly subtitle = computed(
    () => `${this.filtered().length} de ${this.relatorio.items().length} clientes filtrados`,
  );

  protected readonly filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const r = this.risk();
    return this.relatorio.items().filter((row) => {
      if (!row?.cliente) {
        return false;
      }
      const name = row.cliente.nome_cliente.toLowerCase();
      const matchQ = !q || name.includes(q) || row.cliente.owner_id.toLowerCase().includes(q);
      if (r === ALL) {
        return matchQ;
      }
      if (!row.analise) {
        return false;
      }
      const nr = normalizeNivelRisco(row.analise.nivel_risco);
      const matchR = nr === r;
      return matchQ && matchR;
    });
  });

  protected readonly pageSlice = computed(() => {
    const rows = this.filtered();
    const size = this.pageSize();
    const p = this.page();
    const start = (p - 1) * size;
    return rows.slice(start, start + size);
  });

  constructor() {
    effect(() => {
      const n = this.filtered().length;
      const size = this.pageSize();
      const tp = Math.max(1, Math.ceil(n / Math.max(1, size)));
      untracked(() => {
        const p = this.page();
        if (p > tp) {
          this.page.set(tp);
        } else if (p < 1) {
          this.page.set(1);
        }
      });
    });
  }

  /** Cor da legenda "Risco IA" (nota bruta: maior = pior). */
  protected iaRiskLineClass(row: RelatorioClienteItem): string {
    const n = Number(row.analise?.score_ia);
    return iaRiskCaptionClass(Number.isFinite(n) ? n : 0);
  }

  ngOnInit(): void {
    this.relatorio.load();
  }

  protected riskLevel(row: RelatorioClienteItem) {
    return nivelRiscoToRiskLevel(row.analise?.nivel_risco);
  }

  /** Saude 0-100: IA quando existe; senao heuristica operacional (ver `healthScoreFromRelatorioRow`). */
  protected healthScore(row: RelatorioClienteItem): number {
    return healthScoreFromRelatorioRow(row);
  }

  /** Barra na coluna "Saude IA": so quando a API enviou `score_ia` numerico. */
  protected hasScoreIa(row: RelatorioClienteItem): boolean {
    return hasRelatorioScoreIa(row);
  }
}
