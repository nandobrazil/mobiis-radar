import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';

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
import { exportRelatorioClientesToXlsx } from '../../shared/export-relatorio-clientes-xlsx';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideSearch } from '@lucide/angular';
import { initials, iaRiskCaptionClass, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

const ALL = '__all__';

export type ClientesSortColumn =
  | 'cliente'
  | 'dias_sem_uso'
  | 'acoes_30d'
  | 'acoes_90d'
  | 'core'
  | 'usuarios'
  | 'score_ia'
  | 'risco';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [
    AppIconComponent,
    DataTableComponent,
    FormsModule,
    NgSelectComponent,
    TableSkeletonComponent,
    RiskBadgeComponent,
    RouterLink,
    ScoreBarComponent,
    TablePaginationBarComponent,
    TopBarComponent,
  ],
  templateUrl: './radar-page.component.html',
})
export class RadarPageComponent implements OnInit {
  protected readonly relatorio = inject(RelatorioClientesService);
  protected readonly iconSearch = LucideSearch;
  protected readonly iconSortUp = LucideArrowUp;
  protected readonly iconSortDown = LucideArrowDown;
  protected readonly iconSortBoth = LucideArrowUpDown;
  protected readonly ALL = ALL;
  protected readonly riskFilterOptions: { label: string; value: string }[] = [
    { label: 'Todos - Risco', value: ALL },
    { label: 'Alto', value: 'ALTO' },
    { label: 'Medio', value: 'MEDIO' },
    { label: 'Baixo', value: 'BAIXO' },
  ];
  protected readonly q = signal('');
  protected readonly risk = signal(ALL);
  protected readonly initials = initials;

  /** Paginação somente no front (sobre `sortedFiltered()`). */
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  /**
   * Lig/desl por coluna: `false` = cabeçalho sem ordenação (ex.: coluna só visual/composta).
   * Ajuste aqui conforme a tabela.
   */
  protected readonly sortableColumns: Record<ClientesSortColumn, boolean> = {
    cliente: true,
    dias_sem_uso: true,
    acoes_30d: true,
    acoes_90d: true,
    core: false,
    usuarios: true,
    score_ia: true,
    risco: true,
  };

  /** Ordenação ativa; null = ordem original da API após filtros. */
  protected readonly tableSort = signal<{ column: ClientesSortColumn; direction: 'asc' | 'desc' } | null>(null);

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

  protected readonly sortedFiltered = computed(() => {
    const rows = this.filtered();
    const s = this.tableSort();
    if (!s) {
      return rows;
    }
    const dir = s.direction;
    return [...rows].sort((a, b) => this.compareClientesRow(a, b, s.column, dir));
  });

  protected readonly pageSlice = computed(() => {
    const rows = this.sortedFiltered();
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

  protected onRiskFilterChange(value: string): void {
    this.risk.set(value);
    this.page.set(1);
  }

  /** Exporta a lista atual (filtros + ordenação da tabela) para Excel, gerado no navegador. */
  protected exportarPlanilha(): void {
    const rows = this.sortedFiltered();
    if (rows.length === 0) {
      return;
    }
    exportRelatorioClientesToXlsx(rows, 'relatorio-clientes');
  }

  protected toggleSort(column: ClientesSortColumn): void {
    if (!this.sortableColumns[column]) {
      return;
    }
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
    if (s == null || s.column !== column) {
      return 'none';
    }
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  /** Direção ativa para esta coluna, ou null se outra coluna está ordenando / sem ordenação. */
  protected activeSortDirection(column: ClientesSortColumn): 'asc' | 'desc' | null {
    const s = this.tableSort();
    if (s?.column === column) {
      return s.direction;
    }
    return null;
  }

  private riscoSortRank(row: RelatorioClienteItem): number {
    if (!row.analise) {
      return 0;
    }
    const n = normalizeNivelRisco(row.analise.nivel_risco);
    if (n === 'ALTO') return 3;
    if (n === 'MEDIO') return 2;
    return 1;
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
        const va = a.analise?.score_ia;
        const vb = b.analise?.score_ia;
        const na = va != null && Number.isFinite(Number(va)) ? Number(va) : Number.POSITIVE_INFINITY;
        const nb = vb != null && Number.isFinite(Number(vb)) ? Number(vb) : Number.POSITIVE_INFINITY;
        return mult * (na - nb);
      }
      case 'risco':
        return mult * (this.riscoSortRank(a) - this.riscoSortRank(b));
      default:
        return 0;
    }
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
