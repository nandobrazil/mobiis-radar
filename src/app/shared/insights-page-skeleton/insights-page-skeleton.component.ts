import { Component, computed, input } from '@angular/core';

import { InsightCardSkeletonComponent } from '../insight-card-skeleton/insight-card-skeleton.component';
import { TableSkeletonComponent } from '../table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-insights-page-skeleton',
  standalone: true,
  imports: [InsightCardSkeletonComponent, TableSkeletonComponent],
  template: `
    <div class="space-y-6" role="status" aria-busy="true" aria-label="Carregando insights">
      <section
        class="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 shadow-elegant"
      >
        <div class="absolute inset-0 bg-grid opacity-30"></div>
        <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="skeleton h-14 w-14 shrink-0 rounded-2xl"></div>
          <div class="min-w-0 flex-1 space-y-3">
            <div class="flex flex-wrap gap-2">
              <div class="skeleton h-6 w-28 rounded-full"></div>
              <div class="skeleton h-6 w-16 rounded-full"></div>
            </div>
            <div class="skeleton h-8 w-[min(100%,28rem)] max-w-full rounded-lg"></div>
            <div class="skeleton h-4 w-48 max-w-full rounded"></div>
          </div>
          <div class="skeleton h-9 w-24 shrink-0 rounded-lg"></div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
        @for (i of cardSlots(); track i) {
          <app-insight-card-skeleton />
        }
      </section>

      <section class="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div class="space-y-2 border-b border-border px-5 py-4">
          <div class="skeleton h-4 w-48 rounded-md"></div>
          <div class="skeleton h-3 w-64 max-w-full rounded"></div>
        </div>
        <app-table-skeleton [columns]="5" [rows]="tableRows()" [tableClass]="'min-w-[960px]'" />
      </section>
    </div>
  `,
})
export class InsightsPageSkeletonComponent {
  readonly insightCards = input(4);
  readonly tableRows = input(8);

  protected readonly cardSlots = computed(() =>
    Array.from({ length: this.insightCards() }, (_, i) => i),
  );
}
