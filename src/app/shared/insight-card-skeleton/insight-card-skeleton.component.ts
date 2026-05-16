import { Component } from '@angular/core';

@Component({
  selector: 'app-insight-card-skeleton',
  standalone: true,
  template: `
    <article
      class="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card"
      aria-hidden="true"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-muted/50 to-transparent"></div>
      <div class="relative">
        <div class="flex flex-wrap items-start gap-3">
          <div class="skeleton h-10 w-10 shrink-0 rounded-lg"></div>
          <div class="min-w-0 flex-1 space-y-2">
            <div class="skeleton h-3 w-16 rounded"></div>
            <div class="skeleton h-5 w-[min(100%,18rem)] max-w-full rounded-md"></div>
          </div>
          <div class="skeleton h-6 w-24 shrink-0 rounded-full"></div>
        </div>
        <div class="mt-3 space-y-2">
          <div class="skeleton h-3 w-full rounded"></div>
          <div class="skeleton h-3 w-[96%] rounded"></div>
          <div class="skeleton h-3 w-[88%] rounded"></div>
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          @for (i of chipSlots; track i) {
            <div class="skeleton h-6 w-20 rounded-md"></div>
          }
        </div>
        <div class="mt-4 space-y-2 rounded-lg border border-border/60 bg-muted/10 p-3">
          <div class="skeleton h-3 w-24 rounded"></div>
          <div class="skeleton h-3 w-full rounded"></div>
          <div class="skeleton h-3 w-[94%] rounded"></div>
        </div>
      </div>
    </article>
  `,
})
export class InsightCardSkeletonComponent {
  protected readonly chipSlots = [0, 1, 2];
}
