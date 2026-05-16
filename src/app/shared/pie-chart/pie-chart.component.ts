import { Component, input } from '@angular/core';

type Point = Record<string, number | string>;

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  readonly data = input.required<Point[]>();
  readonly labelKey = input.required<string>();
  readonly valueKey = input.required<string>();

  protected readonly colors = [
    'oklch(0.65 0.20 255)',
    'oklch(0.65 0.22 295)',
    'oklch(0.78 0.15 200)',
    'oklch(0.72 0.18 155)',
    'oklch(0.82 0.16 90)',
    'oklch(0.58 0.14 25)',
    'oklch(0.55 0.12 200)',
  ];

  protected total(): number {
    return this.data().reduce((sum, item) => sum + Number(item[this.valueKey()]), 0);
  }

  protected pct(value: number): string {
    const t = Math.max(1, this.total());
    return `${Math.round((value / t) * 100)}%`;
  }

  protected gradient(): string {
    let start = 0;
    const total = Math.max(1, this.total());
    const vk = this.valueKey();
    const stops = this.data().map((item, index) => {
      const value = (Number(item[vk]) / total) * 100;
      const color = this.colors[index % this.colors.length];
      const segment = `${color} ${start}% ${start + value}%`;
      start += value;
      return segment;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

  protected trackSlice(item: Point, index: number): string {
    return `${String(item[this.labelKey()])}-${index}`;
  }

  protected asString(v: unknown): string {
    return String(v ?? '');
  }

  protected asNumber(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
}
