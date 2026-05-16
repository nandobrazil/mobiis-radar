import { Component } from '@angular/core';

@Component({
  selector: 'app-kpi-card-skeleton',
  standalone: true,
  template: `
    <div
      class="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card"
      role="status"
      aria-busy="true"
      aria-label="Carregando indicador"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-muted/50 to-transparent"></div>
      <div class="relative flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1 space-y-3">
          <div class="skeleton h-3 w-28 max-w-[85%] rounded"></div>
          <div class="skeleton h-9 w-24 max-w-[70%] rounded-md"></div>
          <div class="skeleton h-3 w-36 max-w-[95%] rounded"></div>
        </div>
        <div class="skeleton h-10 w-10 shrink-0 rounded-xl"></div>
      </div>
    </div>
  `,
})
export class KpiCardSkeletonComponent {}
