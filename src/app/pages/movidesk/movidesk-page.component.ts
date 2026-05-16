import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import type { MovideskResumo } from '../../data/movidesk-resumo.types';
import type { MovideskTicket } from '../../data/movidesk-ticket.types';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { MovideskTicketsService } from '../../shared/movidesk-tickets.service';
import { TablePaginationBarComponent } from '../../shared/table-pagination-bar/table-pagination-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import {
  LucideCircleDot,
  LucideClock,
  LucideListChecks,
  LucideSearch,
  LucideTicket,
  LucideTimer,
} from '@lucide/angular';

type ChamadosLoad = { error: boolean; rows: MovideskTicket[] };
type ResumoLoad = { ok: boolean; data: MovideskResumo | null };

@Component({
  selector: 'app-movidesk-page',
  standalone: true,
  imports: [
    BarChartComponent,
    DataTableComponent,
    KpiCardComponent,
    LucideSearch,
    TablePaginationBarComponent,
    TopBarComponent,
  ],
  templateUrl: './movidesk-page.component.html',
})
export class MovideskPageComponent implements OnInit {
  private readonly movidesk = inject(MovideskTicketsService);

  protected readonly items = signal<MovideskTicket[]>([]);
  protected readonly resumo = signal<MovideskResumo | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly resumoError = signal(false);
  protected readonly q = signal('');

  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

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
      return 'Carregando chamados e indicadores Movidesk...';
    }
    const periodo = r?.periodo_dias;
    const suffix = periodo != null ? ` · Resumo últimos ${periodo} dias` : '';
    return `${n} de ${t} chamados${suffix}`;
  });

  protected readonly chartStatus = computed(() => this.chartFromRecord(this.resumo()?.por_status));
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

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.resumoError.set(false);
    forkJoin({
      chamados: this.movidesk.list().pipe(
        map((rows): ChamadosLoad => ({
          error: false,
          rows: Array.isArray(rows) ? rows : [],
        })),
        catchError(() => of({ error: true, rows: [] as MovideskTicket[] })),
      ),
      resumo: this.movidesk.resumo().pipe(
        map((data): ResumoLoad => ({ ok: true, data })),
        catchError(() => of({ ok: false, data: null })),
      ),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ chamados, resumo: resumoWrap }) => {
          if (chamados.error) {
            this.error.set('Falha ao carregar chamados. Verifique rede ou CORS.');
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

  protected clientsLabel(t: MovideskTicket): string {
    const names = t.clients
      .filter((c) => !c.isDeleted)
      .map((c) => c.businessName?.trim() || c.email || '—')
      .filter(Boolean);
    return names.length ? names.join(' · ') : '—';
  }

  protected statusTone(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('conclu') || s.includes('fechad')) {
      return 'text-success bg-success/15 border-success/30';
    }
    if (s.includes('cancel')) {
      return 'text-muted-foreground bg-muted/40 border-border';
    }
    if (s.includes('novo')) {
      return 'text-primary bg-primary/15 border-primary/30';
    }
    return 'text-info bg-info/15 border-info/30';
  }

  private chartFromRecord(rec: Record<string, number> | undefined, max = 14): { label: string; value: number }[] {
    if (!rec) {
      return [];
    }
    return Object.entries(rec)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, max);
  }
}
