import { Component, computed, input, signal, effect, untracked } from '@angular/core';
import type { RelatorioClienteItem } from '../../../../data/relatorio-clientes.types';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { TableSkeletonComponent } from '../../../../shared/table-skeleton/table-skeleton.component';
import { RiskBadgeComponent } from '../../../../shared/risk-badge/risk-badge.component';
import { normalizeNivelRisco } from '../../../../shared/relatorio-clientes.service';
import { ScoreBarComponent } from '../../../../shared/score-bar/score-bar.component';
import { AppIconComponent } from '../../../../shared/app-icon/app-icon.component';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown } from '@lucide/angular';
import { TablePaginationBarComponent } from '../../../../shared/table-pagination-bar/table-pagination-bar.component';

interface SegmentGroup {
  name: string;
  total: number;
  alto: number;
  medio: number;
  baixo: number;
  avgScore: number;
  usuarios: number;
  acoes30d: number;
}

@Component({
  selector: 'app-radar-segments',
  standalone: true,
  imports: [
    DataTableComponent,
    TableSkeletonComponent,
    ScoreBarComponent,
    TablePaginationBarComponent,
  ],
  templateUrl: './radar-segments.component.html',
})
export class RadarSegmentsComponent {
  data = input.required<RelatorioClienteItem[]>();
  loading = input<boolean>(false);

  protected readonly iconSortUp = LucideArrowUp;
  protected readonly iconSortDown = LucideArrowDown;
  protected readonly iconSortBoth = LucideArrowUpDown;

  protected readonly segmentsData = computed(() => {
    const rows = this.data();
    const groups: Record<string, {
      name: string;
      total: number;
      alto: number;
      medio: number;
      baixo: number;
      scoreSum: number;
      scoreCount: number;
      usuarios: number;
      acoes30d: number;
    }> = {};

    rows.forEach((row) => {
      const cnaeCode = row.owner?.cnae_fiscal?.toString() || '0';
      const cnaeDesc = row.owner?.cnae_fiscal_descricao || 'Sem Segmento';

      if (!groups[cnaeCode]) {
        groups[cnaeCode] = {
          name: cnaeDesc,
          total: 0,
          alto: 0,
          medio: 0,
          baixo: 0,
          scoreSum: 0,
          scoreCount: 0,
          usuarios: 0,
          acoes30d: 0,
        };
      }
      const g = groups[cnaeCode];
      g.total++;
      g.usuarios += row.cliente.usuarios_ativos;
      g.acoes30d += row.cliente.acoes_30d;
      
      if (row.analise) {
        const nr = normalizeNivelRisco(row.analise.nivel_risco);
        if (nr === 'ALTO') g.alto++;
        else if (nr === 'MEDIO') g.medio++;
        else g.baixo++;
        
        const score = row.analise.score_ia;
        if (score != null) {
          g.scoreSum += score;
          g.scoreCount++;
        }
      }
    });

    return Object.values(groups).map(g => ({
      name: g.name,
      total: g.total,
      alto: g.alto,
      medio: g.medio,
      baixo: g.baixo,
      avgScore: g.scoreCount > 0 ? Math.round(g.scoreSum / g.scoreCount) : 0,
      usuarios: g.usuarios,
      acoes30d: g.acoes30d,
    })).sort((a, b) => b.total - a.total);
  });
  
  /** Paginação somente no front (sobre `segmentsData()`). */
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly pageSlice = computed(() => {
    const rows = this.segmentsData();
    const size = this.pageSize();
    const p = this.page();
    const start = (p - 1) * size;
    return rows.slice(start, start + size);
  });

  constructor() {
    effect(() => {
      const n = this.segmentsData().length;
      const size = this.pageSize();
      const tp = Math.max(1, Math.ceil(n / Math.max(1, size)));
      untracked(() => {
        const p = this.page();
        if (p > tp) this.page.set(tp);
      });
    });
  }
}
