import { Component, computed, input, signal, untracked, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { RelatorioClienteItem } from '../../../../data/relatorio-clientes.types';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { TableSkeletonComponent } from '../../../../shared/table-skeleton/table-skeleton.component';
import { RiskBadgeComponent } from '../../../../shared/risk-badge/risk-badge.component';
import {
  hasRelatorioScoreIa,
  healthScoreFromRelatorioRow,
} from '../../../../shared/relatorio-clientes.service';
import { ScoreBarComponent } from '../../../../shared/score-bar/score-bar.component';
import { TablePaginationBarComponent } from '../../../../shared/table-pagination-bar/table-pagination-bar.component';
import { exportRelatorioClientesToXlsx } from '../../../../shared/export-relatorio-clientes-xlsx';
import { AppIconComponent } from '../../../../shared/app-icon/app-icon.component';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideArrowUpDown,
} from '@lucide/angular';
import { formatPerfilUso, initials, nivelRiscoToRiskLevel } from '../../../../shared/ui-helpers';

export type ClientesSortColumn =
  | 'cliente'
  | 'perfil_uso'
  | 'dias_sem_uso'
  | 'acoes_30d'
  | 'acoes_90d'
  | 'core'
  | 'usuarios'
  | 'score_ia'
  | 'risco';

@Component({
  selector: 'app-radar-list',
  standalone: true,
  imports: [
    AppIconComponent,
    DataTableComponent,
    TableSkeletonComponent,
    RiskBadgeComponent,
    RouterLink,
    ScoreBarComponent,
    TablePaginationBarComponent,
  ],
  templateUrl: './radar-list.component.html',
})
export class RadarListComponent {
  /** Dados filtrados vindos do pai. */
  data = input.required<RelatorioClienteItem[]>();
  loading = input<boolean>(false);

  protected readonly iconSortUp = LucideArrowUp;
  protected readonly iconSortDown = LucideArrowDown;
  protected readonly iconSortBoth = LucideArrowUpDown;
  protected readonly initials = initials;
  protected readonly formatPerfilUso = formatPerfilUso;

  /** Paginação somente no front (sobre `sortedData()`). */
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly sortableColumns: Record<ClientesSortColumn, boolean> = {
    cliente: true,
    perfil_uso: true,
    dias_sem_uso: true,
    acoes_30d: true,
    acoes_90d: true,
    core: false,
    usuarios: true,
    score_ia: true,
    risco: true,
  };

  protected readonly tableSort = signal<{ column: ClientesSortColumn; direction: 'asc' | 'desc' } | null>(null);

  protected readonly sortedData = computed(() => {
    const rows = this.data();
    const s = this.tableSort();
    if (!s) return rows;
    return [...rows].sort((a, b) => this.compareClientesRow(a, b, s.column, s.direction));
  });

  protected readonly pageSlice = computed(() => {
    const rows = this.sortedData();
    const size = this.pageSize();
    const p = this.page();
    const start = (p - 1) * size;
    return rows.slice(start, start + size);
  });

  constructor() {
    effect(() => {
      const n = this.data().length;
      const size = this.pageSize();
      const tp = Math.max(1, Math.ceil(n / Math.max(1, size)));
      untracked(() => {
        const p = this.page();
        if (p > tp) this.page.set(tp);
      });
    });
  }

  protected exportarPlanilha(): void {
    const rows = this.sortedData();
    if (rows.length === 0) return;
    exportRelatorioClientesToXlsx(rows, 'relatorio-clientes');
  }

  protected toggleSort(column: ClientesSortColumn): void {
    if (!this.sortableColumns[column]) return;
    const cur = this.tableSort();
    if (cur == null || cur.column !== column) {
      this.tableSort.set({ column, direction: 'asc' });
    } else if (cur.direction === 'asc') {
      this.tableSort.set({ column, direction: 'desc' });
    } else {
      this.tableSort.set(null);
    }
    this.page.set(1);
  }

  protected ariaSort(column: ClientesSortColumn): 'ascending' | 'descending' | 'none' {
    const s = this.tableSort();
    if (s == null || s.column !== column) return 'none';
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected activeSortDirection(column: ClientesSortColumn): 'asc' | 'desc' | null {
    const s = this.tableSort();
    return s?.column === column ? s.direction : null;
  }

  private compareClientesRow(
    a: RelatorioClienteItem,
    b: RelatorioClienteItem,
    column: ClientesSortColumn,
    direction: 'asc' | 'desc',
  ): number {
    const mult = direction === 'asc' ? 1 : -1;
    switch (column) {
      case 'cliente':
        return mult * a.cliente.nome_cliente.localeCompare(b.cliente.nome_cliente, 'pt-BR', { sensitivity: 'base' });
      case 'perfil_uso':
        return mult * (a.analise?.perfil_uso || '').localeCompare(b.analise?.perfil_uso || '', 'pt-BR', { sensitivity: 'base' });
      case 'dias_sem_uso':
        return mult * (a.cliente.dias_sem_atividade - b.cliente.dias_sem_atividade);
      case 'acoes_30d':
        return mult * (a.cliente.acoes_30d - b.cliente.acoes_30d);
      case 'acoes_90d':
        return mult * (a.cliente.acoes_90d - b.cliente.acoes_90d);
      case 'core':
        return mult * (a.cliente.acoes_core_30d - b.cliente.acoes_core_30d);
      case 'usuarios':
        return mult * (a.cliente.usuarios_ativos - b.cliente.usuarios_ativos);
      case 'score_ia': {
        const na = a.analise?.score_ia ?? Number.POSITIVE_INFINITY;
        const nb = b.analise?.score_ia ?? Number.POSITIVE_INFINITY;
        return mult * (na - nb);
      }
      case 'risco':
        return mult * (this.riscoRank(a) - this.riscoRank(b));
      default:
        return 0;
    }
  }

  private riscoRank(row: RelatorioClienteItem): number {
    const r = row.analise?.nivel_risco?.toUpperCase();
    if (r === 'ALTO') return 3;
    if (r === 'MEDIO') return 2;
    return 1;
  }

  protected riskLevel(row: RelatorioClienteItem) {
    return nivelRiscoToRiskLevel(row.analise?.nivel_risco);
  }

  protected healthScore(row: RelatorioClienteItem): number {
    return healthScoreFromRelatorioRow(row);
  }

  protected hasScoreIa(row: RelatorioClienteItem): boolean {
    return hasRelatorioScoreIa(row);
  }
}
