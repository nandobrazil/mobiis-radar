import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
} from '@angular/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import type { EChartsType } from 'echarts/core';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

type Point = Record<string, number | string>;

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: '<div class="chart-root"></div>',
  styles: `
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    .chart-root {
      height: 100%;
      width: 100%;
      min-height: 140px;
    }
  `,
})
export class BarChartComponent implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly data = input.required<Point[]>();
  readonly labelKey = input.required<string>();
  readonly valueKey = input.required<string>();

  private chart?: EChartsType;
  private resizeObserver?: ResizeObserver;

  constructor() {
    this.destroyRef.onDestroy(() => this.teardown());
    effect(() => {
      this.data();
      this.labelKey();
      this.valueKey();
      if (this.chart) {
        this.render();
      }
    });
  }

  ngAfterViewInit(): void {
    const el = this.host.nativeElement.querySelector('.chart-root');
    if (!(el instanceof HTMLDivElement)) {
      return;
    }
    this.chart = echarts.init(el, undefined, { renderer: 'canvas' });
    this.render();
    this.resizeObserver = new ResizeObserver(() => this.chart?.resize());
    this.resizeObserver.observe(el);
  }

  private teardown(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.chart?.dispose();
    this.chart = undefined;
  }

  private render(): void {
    if (!this.chart) {
      return;
    }
    const rows = this.data();
    const lk = this.labelKey();
    const vk = this.valueKey();
    const categories = rows.map((r) => String(r[lk] ?? ''));
    const values = rows.map((r) => Number(r[vk]) || 0);
    const rotate = categories.some((c) => c.length > 12) ? 26 : 0;

    this.chart.setOption(
      {
        animationDuration: 380,
        grid: { left: 4, right: 8, top: 28, bottom: 0, containLabel: true },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisTick: { alignWithLabel: true },
          axisLabel: {
            interval: 0,
            rotate,
            fontSize: 10,
            color: '#64748b',
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontSize: 10, color: '#64748b' },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.22)' } },
        },
        series: [
          {
            type: 'bar',
            data: values,
            barMaxWidth: 44,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6366f1' },
                { offset: 1, color: '#a855f7' },
              ]),
            },
          },
        ],
      },
      { notMerge: true },
    );
  }
}
