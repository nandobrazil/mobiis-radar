import { Component, input } from '@angular/core';

type Point = Record<string, number | string>;

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.css',
})
export class DonutChartComponent {
  readonly data = input.required<Point[]>();
  readonly labelKey = input.required<string>();
  readonly valueKey = input.required<string>();
  protected readonly colors = [
    'oklch(0.65 0.20 255)',
    'oklch(0.65 0.22 295)',
    'oklch(0.78 0.15 200)',
    'oklch(0.72 0.18 155)',
    'oklch(0.82 0.16 90)',
  ];

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
