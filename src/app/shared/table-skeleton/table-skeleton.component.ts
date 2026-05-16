import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  templateUrl: './table-skeleton.component.html',
})
export class TableSkeletonComponent {
  readonly columns = input(8);
  readonly rows = input(8);
  readonly tableClass = input<string>();

  protected readonly colKeys = computed(() =>
    Array.from({ length: this.columns() }, (_, i) => i),
  );
  protected readonly rowKeys = computed(() =>
    Array.from({ length: this.rows() }, (_, i) => i),
  );

  protected headerWidth(i: number): string {
    const pct = [55, 70, 48, 62, 40, 75, 50, 68, 44, 58];
    return `${pct[i % pct.length]}%`;
  }

  protected cellClass(r: number, c: number): string {
    const widths = [
      'max-w-[3.5rem]',
      'max-w-[6rem]',
      'max-w-[10rem]',
      'max-w-[5rem]',
      'max-w-[8rem]',
      'max-w-[12rem]',
      'w-full max-w-[14rem]',
    ];
    return widths[(r * 2 + c) % widths.length];
  }
}
