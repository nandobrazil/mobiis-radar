import { Component, input } from '@angular/core';

type Point = Record<string, number | string>;

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
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
