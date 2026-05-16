import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { finalize } from 'rxjs/operators';

import type { MovideskTicket } from '../../data/movidesk-ticket.types';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { MovideskTicketsService } from '../../shared/movidesk-tickets.service';
import { TablePaginationBarComponent } from '../../shared/table-pagination-bar/table-pagination-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [DataTableComponent, LucideSearch, TablePaginationBarComponent, TopBarComponent],
  templateUrl: './tickets-page.component.html',
})
export class TicketsPageComponent implements OnInit {
  private readonly movidesk = inject(MovideskTicketsService);

  protected readonly items = signal<MovideskTicket[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly q = signal('');

  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly subtitle = computed(() => {
    const n = this.filtered().length;
    const t = this.items().length;
    if (this.loading() && t === 0) {
      return 'Carregando chamados Movidesk...';
    }
    return `${n} de ${t} chamados`;
  });

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
    this.movidesk
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => {
          this.items.set(Array.isArray(rows) ? rows : []);
          this.error.set(null);
        },
        error: () => {
          this.error.set('Falha ao carregar tickets. Verifique rede ou CORS.');
          this.items.set([]);
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
}
