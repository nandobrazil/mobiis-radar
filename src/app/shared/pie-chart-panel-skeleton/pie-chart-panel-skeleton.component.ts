import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-chart-panel-skeleton',
  standalone: true,
  template: `
    <div
      class="rounded-2xl border border-border bg-card p-5 shadow-card"
      role="status"
      aria-busy="true"
      aria-label="Carregando gráfico"
    >
      <div class="skeleton mb-3 h-4 w-36 max-w-[70%] rounded"></div>
      <div
        class="flex h-[220px] flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-center"
      >
        <div class="skeleton aspect-square w-[min(9.5rem,42vw)] max-w-[42vw] shrink-0 rounded-full"></div>
        <div class="flex w-full min-w-0 max-w-[16rem] flex-1 flex-col gap-2 sm:max-w-[12rem]">
          @for (i of legendLines; track i) {
            <div class="skeleton h-3 rounded" [style.width.%]="legendWidth(i)"></div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PieChartPanelSkeletonComponent {
  protected readonly legendLines = [0, 1, 2, 3, 4];

  protected legendWidth(i: number): number {
    return [92, 78, 85, 70, 88][i] ?? 80;
  }
}
