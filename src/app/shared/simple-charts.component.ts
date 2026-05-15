import { Component, input } from '@angular/core';

type Point = Record<string, number | string>;

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    <svg viewBox="0 0 640 260" class="h-full w-full overflow-visible">
      <defs>
        @for (series of series(); track series.key) {
          <linearGradient [attr.id]="'fill-' + chartId() + '-' + series.key" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" [attr.stop-color]="series.color" stop-opacity="0.35" />
            <stop offset="95%" [attr.stop-color]="series.color" stop-opacity="0" />
          </linearGradient>
        }
      </defs>
      @for (line of gridLines; track line) {
        <line x1="36" x2="620" [attr.y1]="line" [attr.y2]="line" stroke="oklch(1 0 0 / 7%)" stroke-dasharray="3 3" />
      }
      @for (series of series(); track series.key) {
        <path [attr.d]="areaPath(series.key)" [attr.fill]="'url(#fill-' + chartId() + '-' + series.key + ')'" />
        <path [attr.d]="linePath(series.key)" fill="none" [attr.stroke]="series.color" stroke-width="2.5" stroke-linecap="round" />
      }
      @for (item of data(); track labelOf(item); let i = $index) {
        <text [attr.x]="x(i)" y="250" fill="oklch(0.7 0.02 260)" font-size="11" text-anchor="middle">{{ labelOf(item) }}</text>
      }
    </svg>
  `,
})
export class LineChartComponent {
  readonly data = input.required<Point[]>();
  readonly labelKey = input.required<string>();
  readonly series = input.required<{ key: string; color: string }[]>();
  readonly chartId = input('chart');
  protected readonly gridLines = [40, 90, 140, 190, 230];

  protected labelOf(item: Point) {
    return item[this.labelKey()];
  }

  protected maxValue() {
    return Math.max(1, ...this.data().flatMap((item) => this.series().map((series) => Number(item[series.key]))));
  }

  protected x(index: number) {
    const length = Math.max(1, this.data().length - 1);
    return 36 + (index / length) * 584;
  }

  protected y(value: number) {
    return 230 - (value / this.maxValue()) * 190;
  }

  protected linePath(key: string) {
    return this.data()
      .map((item, index) => `${index === 0 ? 'M' : 'L'} ${this.x(index)} ${this.y(Number(item[key]))}`)
      .join(' ');
  }

  protected areaPath(key: string) {
    const points = this.linePath(key);
    return `${points} L ${this.x(this.data().length - 1)} 230 L 36 230 Z`;
  }
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    <div class="flex h-full items-end gap-3 px-2 pt-4">
      @for (item of data(); track item[labelKey()]) {
        <div class="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div
            class="w-full rounded-t-lg bg-gradient-to-b from-primary to-purple"
            [style.height.%]="height(Number(item[valueKey()]))"
          ></div>
          <span class="w-full truncate text-center text-[10px] text-muted-foreground">{{ item[labelKey()] }}</span>
        </div>
      }
    </div>
  `,
})
export class BarChartComponent {
  readonly data = input.required<Point[]>();
  readonly labelKey = input.required<string>();
  readonly valueKey = input.required<string>();
  protected readonly Number = Number;

  protected height(value: number) {
    const max = Math.max(1, ...this.data().map((item) => Number(item[this.valueKey()])));
    return (value / max) * 88;
  }
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  template: `
    <div class="grid h-full place-items-center">
      <div class="relative grid h-44 w-44 place-items-center rounded-full" [style.background]="gradient()">
        <div class="grid h-24 w-24 place-items-center rounded-full bg-card text-center">
          <span class="text-2xl font-semibold">{{ total() }}</span>
          <span class="-mt-5 text-[10px] text-muted-foreground">clientes</span>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        @for (item of data(); track item[labelKey()]; let i = $index) {
          <span class="truncate"><span class="mr-1 inline-block h-2 w-2 rounded-full" [style.background]="colors[i % colors.length]"></span>{{ item[labelKey()] }}</span>
        }
      </div>
    </div>
  `,
})
export class DonutChartComponent {
  readonly data = input.required<Point[]>();
  readonly labelKey = input.required<string>();
  readonly valueKey = input.required<string>();
  protected readonly colors = ['oklch(0.65 0.20 255)', 'oklch(0.65 0.22 295)', 'oklch(0.78 0.15 200)', 'oklch(0.72 0.18 155)', 'oklch(0.82 0.16 90)'];

  protected total() {
    return this.data().reduce((sum, item) => sum + Number(item[this.valueKey()]), 0);
  }

  protected gradient() {
    let start = 0;
    const total = Math.max(1, this.total());
    const stops = this.data().map((item, index) => {
      const value = (Number(item[this.valueKey()]) / total) * 100;
      const color = this.colors[index % this.colors.length];
      const segment = `${color} ${start}% ${start + value}%`;
      start += value;
      return segment;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }
}
