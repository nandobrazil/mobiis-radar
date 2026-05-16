import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import type { AtendimentoResumo } from '../../data/atendimento-resumo.types';
import { atendimentoRotuloGrafico } from '../../data/atendimento-grafico-labels';
import { atendimentoStatusLabelPt } from '../../data/atendimento-status-i18n';
import type { AtendimentoTicket } from '../../data/atendimento-ticket.types';
import { PieChartComponent } from '../../shared/pie-chart/pie-chart.component';
import { PieChartPanelSkeletonComponent } from '../../shared/pie-chart-panel-skeleton/pie-chart-panel-skeleton.component';
import { KpiCardSkeletonComponent } from '../../shared/kpi-card-skeleton/kpi-card-skeleton.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { TableSkeletonComponent } from '../../shared/table-skeleton/table-skeleton.component';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { AtendimentoTicketsService } from '../../shared/atendimento-tickets.service';
import { TablePaginationBarComponent } from '../../shared/table-pagination-bar/table-pagination-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideArrowUpDown,
  LucideCircleDot,
  LucideClock,
  LucideListChecks,
  LucideSearch,
  LucideTicket,
  LucideTimer,
} from '@lucide/angular';

type ChamadosLoad = { error: boolean; rows: AtendimentoTicket[] };
type ResumoLoad = { ok: boolean; data: AtendimentoResumo | null };

type AtendimentoSortColumn =
  | 'id'
  | 'subject'
  | 'tags'
  | 'status'
  | 'urgency'
  | 'category'
  | 'ownerTeam'
  | 'clients'
  | 'createdDate'
  | 'lastUpdate';

@Component({
  selector: 'app-atendimento-page',
  standalone: true,
  imports: [
    AppIconComponent,
    PieChartComponent,
    PieChartPanelSkeletonComponent,
    KpiCardSkeletonComponent,
    DataTableComponent,
    TableSkeletonComponent,
    KpiCardComponent,
    TablePaginationBarComponent,
    TopBarComponent,
  ],
  templateUrl: './atendimento-page.component.html',
})
export class AtendimentoPageComponent implements OnInit {
  private readonly atendimento = inject(AtendimentoTicketsService);

  protected readonly iconSearch = LucideSearch;
  protected readonly iconSortUp = LucideArrowUp;
  protected readonly iconSortDown = LucideArrowDown;
  protected readonly iconSortBoth = LucideArrowUpDown;

  protected readonly items = signal<AtendimentoTicket[]>([]);
  protected readonly resumo = signal<AtendimentoResumo | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly resumoError = signal(false);
  protected readonly q = signal('');

  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  /** Ordenação ativa; null = ordem devolvida pela API após o filtro de busca. */
  protected readonly tableSort = signal<{ column: AtendimentoSortColumn; direction: 'asc' | 'desc' } | null>(null);

  protected readonly sortableColumns: Record<AtendimentoSortColumn, boolean> = {
    id: true,
    subject: true,
    tags: true,
    status: true,
    urgency: true,
    category: true,
    ownerTeam: true,
    clients: true,
    createdDate: true,
    lastUpdate: true,
  };

  /** Slots para skeletons de KPI (layout espelha os 5 cards reais). */
  protected readonly kpiSkeletonSlots = [0, 1, 2, 3, 4] as const;
  protected readonly chartSkeletonSlots = [0, 1, 2] as const;

  protected readonly iconTotal = LucideTicket;
  protected readonly iconAbertos = LucideCircleDot;
  protected readonly iconAndamento = LucideTimer;
  protected readonly iconEncerrados = LucideListChecks;
  protected readonly iconTempo = LucideClock;
  protected readonly subtitle = computed(() => {
    const n = this.filtered().length;
    const t = this.items().length;
    const r = this.resumo();
    if (this.loading() && t === 0 && !r) {
      return 'Carregando chamados e indicadores de Atendimento...';
    }
    const periodo = r?.periodo_dias;
    const suffix = periodo != null ? ` · Resumo últimos ${periodo} dias` : '';
    return `${n} de ${t} chamados${suffix}`;
  });

  protected readonly chartStatus = computed(() =>
    this.chartFromRecord(this.resumo()?.por_status, 14, atendimentoStatusLabelPt),
  );
  protected readonly chartCategoria = computed(() => this.chartFromRecord(this.resumo()?.por_categoria));
  protected readonly chartUrgencia = computed(() => this.chartFromRecord(this.resumo()?.por_urgencia));

  protected readonly filtered = computed(() => {
    const query = this.q().trim().toLowerCase();
    const rows = this.items();
    if (!query) {
      return rows;
    }
    return rows.filter((row) => {
      const hay = [
        String(row.id),
        row.subject,
        row.status,
        row.ownerTeam,
        row.category ?? '',
        row.urgency,
        ...row.tags,
        ...row.clients.map((c) => [c.businessName ?? '', c.email ?? ''].join(' ')),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(query);
    });
  });

  protected readonly sortedFiltered = computed(() => {
    const rows = this.filtered();
    const s = this.tableSort();
    if (!s) {
      return rows;
    }
    const dir = s.direction;
    return [...rows].sort((a, b) => this.compareTicketRow(a, b, s.column, dir));
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

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.resumoError.set(false);
    forkJoin({
      chamados: this.atendimento.list().pipe(
        map((rows): ChamadosLoad => ({
          error: false,
          rows: Array.isArray(rows) ? rows : [],
        })),
        catchError(() => of({ error: true, rows: [] as AtendimentoTicket[] })),
      ),
      resumo: this.atendimento.resumo().pipe(
        map((data): ResumoLoad => ({ ok: true, data })),
        catchError(() => of({ ok: false, data: null })),
      ),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ chamados, resumo: resumoWrap }) => {
          if (chamados.error) {
            this.error.set('Falha ao carregar chamados. Verifique a rede ou CORS.');
            this.items.set([]);
          } else {
            this.error.set(null);
            this.items.set(chamados.rows);
          }
          if (resumoWrap.ok) {
            this.resumo.set(resumoWrap.data);
            this.resumoError.set(false);
          } else {
            this.resumo.set(null);
            this.resumoError.set(true);
          }
        },
      });
  }

  protected formatDt(iso: string): string {
    try {
      return new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  protected formatHoras(h: number): string {
    return `${h.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`;
  }

  protected clientsLabel(t: AtendimentoTicket): string {
    const names = t.clients
      .filter((c) => !c.isDeleted)
      .map((c) => c.businessName?.trim() || c.email || '—')
      .filter(Boolean);
    return names.length ? names.join(' · ') : '—';
  }

  protected readonly statusLabelPt = atendimentoStatusLabelPt;

  protected toggleSort(column: AtendimentoSortColumn): void {
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

  protected ariaSort(column: AtendimentoSortColumn): 'ascending' | 'descending' | 'none' {
    const s = this.tableSort();
    if (s == null || s.column !== column) {
      return 'none';
    }
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected activeSortDirection(column: AtendimentoSortColumn): 'asc' | 'desc' | null {
    const s = this.tableSort();
    if (s?.column === column) {
      return s.direction;
    }
    return null;
  }

  private compareTicketRow(
    a: AtendimentoTicket,
    b: AtendimentoTicket,
    column: AtendimentoSortColumn,
    direction: 'asc' | 'desc',
  ): number {
    const mult = direction === 'asc' ? 1 : -1;
    switch (column) {
      case 'id':
        return mult * (a.id - b.id);
      case 'subject':
        return mult * a.subject.localeCompare(b.subject, 'pt-BR', { sensitivity: 'base' });
      case 'tags': {
        const ta = a.tags.join(' ').toLowerCase();
        const tb = b.tags.join(' ').toLowerCase();
        return mult * ta.localeCompare(tb, 'pt-BR', { sensitivity: 'base' });
      }
      case 'status':
        return mult * atendimentoStatusLabelPt(a.status).localeCompare(atendimentoStatusLabelPt(b.status), 'pt-BR', {
          sensitivity: 'base',
        });
      case 'urgency':
        return mult * a.urgency.localeCompare(b.urgency, 'pt-BR', { sensitivity: 'base' });
      case 'category': {
        const ca = (a.category ?? '').toLowerCase();
        const cb = (b.category ?? '').toLowerCase();
        return mult * ca.localeCompare(cb, 'pt-BR', { sensitivity: 'base' });
      }
      case 'ownerTeam':
        return mult * a.ownerTeam.localeCompare(b.ownerTeam, 'pt-BR', { sensitivity: 'base' });
      case 'clients':
        return mult * this.clientsLabel(a).localeCompare(this.clientsLabel(b), 'pt-BR', { sensitivity: 'base' });
      case 'createdDate':
        return mult * (this.parseTicketDate(a.createdDate) - this.parseTicketDate(b.createdDate));
      case 'lastUpdate':
        return mult * (this.parseTicketDate(a.lastUpdate) - this.parseTicketDate(b.lastUpdate));
      default:
        return 0;
    }
  }

  private parseTicketDate(iso: string): number {
    const t = Date.parse(iso);
    return Number.isNaN(t) ? 0 : t;
  }

  protected statusTone(status: string): string {
    const s = status.toLowerCase();
    if (
      s.includes('closed') ||
      s.includes('resolved') ||
      s.includes('conclu') ||
      s.includes('fechad') ||
      s.includes('resolv')
    ) {
      return 'text-success bg-success/15 border-success/30';
    }
    if (s.includes('cancel')) {
      return 'text-muted-foreground bg-muted/40 border-border';
    }
    if (s.includes('new') || s.includes('novo')) {
      return 'text-primary bg-primary/15 border-primary/30';
    }
    return 'text-info bg-info/15 border-info/30';
  }

  private chartFromRecord(
    rec: Record<string, number> | undefined,
    max = 14,
    labelDePara?: (chaveApi: string) => string,
  ): { label: string; value: number }[] {
    if (!rec) {
      return [];
    }
    return Object.entries(rec)
      .map(([chave, value]) => {
        const bruto = labelDePara ? labelDePara(chave) : chave;
        return {
          label: atendimentoRotuloGrafico(bruto),
          value,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, max);
  }
}
