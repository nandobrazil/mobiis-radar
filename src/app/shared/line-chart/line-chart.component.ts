import { Component, input } from '@angular/core';

type Point = Record<string, number | string>;

@Component({
  selector: 'app-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
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
