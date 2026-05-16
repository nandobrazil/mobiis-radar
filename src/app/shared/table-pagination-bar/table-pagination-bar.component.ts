import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

/** Controles de paginação apenas no cliente (fatia dos dados já carregados). */
@Component({
  selector: 'app-table-pagination-bar',
  standalone: true,
  imports: [FormsModule, NgSelectComponent],
  templateUrl: './table-pagination-bar.component.html',
  styleUrl: './table-pagination-bar.component.css',
})
export class TablePaginationBarComponent {
  /** Total de linhas na fonte (após filtros). */
  totalCount = input.required<number>();
  /** Página atual (1-based). */
  page = input.required<number>();
  pageSize = input.required<number>();

  pageChange = output<number>();
  pageSizeChange = output<number>();

  protected readonly pageSizeOptionsList: number[] = [10, 25, 50, 100];

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(Math.max(0, this.totalCount()) / Math.max(1, this.pageSize()))),
  );

  /** Até 5 números de página visíveis, centrados na página atual (quando há mais de 5 páginas). */
  protected readonly visiblePageNumbers = computed(() => {
    if (this.totalCount() === 0) {
      return [] as number[];
    }
    const total = this.totalPages();
    const cur = this.page();
    const windowSize = 5;
    if (total <= windowSize) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const start = Math.min(Math.max(1, cur - 2), total - windowSize + 1);
    return Array.from({ length: windowSize }, (_, i) => start + i);
  });

  protected readonly rangeStart = computed(() => {
    const t = this.totalCount();
    if (t === 0) {
      return 0;
    }
    return (this.page() - 1) * this.pageSize() + 1;
  });

  protected readonly rangeEnd = computed(() =>
    Math.min(this.totalCount(), this.page() * this.pageSize()),
  );

  protected prev(): void {
    if (this.page() > 1) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  protected next(): void {
    if (this.page() < this.totalPages()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  protected goTo(p: number): void {
    const total = this.totalPages();
    if (this.totalCount() === 0 || total <= 1) {
      return;
    }
    const next = Math.min(Math.max(1, Math.floor(p)), total);
    if (next !== this.page()) {
      this.pageChange.emit(next);
    }
  }

  protected onPageSizeSelect(v: number | string): void {
    const n = typeof v === 'string' ? Number(v) : v;
    if (!Number.isFinite(n) || n < 1) {
      return;
    }
    this.pageSizeChange.emit(n);
    this.pageChange.emit(1);
  }
}
