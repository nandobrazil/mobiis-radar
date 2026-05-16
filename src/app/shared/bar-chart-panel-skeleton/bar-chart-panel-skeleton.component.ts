import { Component } from '@angular/core';

@Component({
  selector: 'app-bar-chart-panel-skeleton',
  standalone: true,
  template: `
    <div
      class="flex h-full min-h-[200px] w-full flex-col justify-end rounded-lg border border-border/60 bg-muted/15 p-3"
      role="status"
      aria-busy="true"
      aria-label="Carregando gráfico"
    >
      <div class="flex flex-1 items-end justify-around gap-1.5 px-1 pb-1 pt-4">
        @for (i of bars; track i) {
          <div
            class="skeleton w-full max-w-[2.75rem] rounded-t-md"
            [style.height.%]="barHeight(i)"
          ></div>
        }
      </div>
      <div class="mt-2 flex justify-around gap-1 border-t border-border/40 pt-2">
        @for (i of bars; track i) {
          <div class="skeleton h-2 w-full max-w-[2.5rem] rounded"></div>
        }
      </div>
    </div>
  `,
})
export class BarChartPanelSkeletonComponent {
  protected readonly bars = [0, 1, 2, 3, 4, 5, 6, 7];

  protected barHeight(i: number): number {
    const h = [38, 58, 46, 72, 42, 64, 52, 36];
    return h[i % h.length] ?? 45;
  }
}
