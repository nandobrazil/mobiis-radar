import { Component, computed, input, output } from '@angular/core';

/** Controles de paginação apenas no cliente (fatia dos dados já carregados). */
@Component({
  selector: 'app-table-pagination-bar',
  standalone: true,
  templateUrl: './table-pagination-bar.component.html',
})
export class TablePaginationBarComponent {
  /** Total de linhas na fonte (após filtros). */
  totalCount = input.required<number>();
  /** Página atual (1-based). */
  page = input.required<number>();
  pageSize = input.required<number>();

  pageChange = output<number>();
  pageSizeChange = output<number>();

  protected readonly pageSizeOptions = [10, 25, 50, 100] as const;

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(Math.max(0, this.totalCount()) / Math.max(1, this.pageSize()))),
  );

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

  protected onPageSizeSelect(ev: Event): void {
    const v = Number((ev.target as HTMLSelectElement).value);
    if (!Number.isFinite(v) || v < 1) {
      return;
    }
    this.pageSizeChange.emit(v);
    this.pageChange.emit(1);
  }
}
