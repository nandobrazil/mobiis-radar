import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <div class="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-elegant">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b" [class]="toneClass()"></div>
      <div class="relative flex items-start justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{{ label() }}</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight">{{ value() }}</p>
          @if (hint()) {
            <p class="mt-1 text-xs text-muted-foreground">{{ hint() }}</p>
          }
        </div>
        <div class="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background/60" [class]="toneClass()">
          <span class="text-lg">{{ icon() }}</span>
        </div>
      </div>
      @if (delta() !== undefined) {
        <div class="relative mt-4 flex items-center gap-1.5 text-xs">
          <span
            class="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium"
            [class]="positive() ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'"
          >
            {{ positive() ? '↗' : '↘' }} {{ absDelta() }}%
          </span>
          <span class="text-muted-foreground">vs periodo anterior</span>
        </div>
      }
    </div>
  `,
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly delta = input<number>();
  readonly icon = input.required<string>();
  readonly tone = input<'default' | 'success' | 'warning' | 'danger' | 'primary'>('default');
  readonly hint = input<string>();

  toneClass() {
    const map = {
      default: 'from-muted/40 to-muted/0 text-foreground',
      success: 'from-success/15 to-success/0 text-success',
      warning: 'from-warning/15 to-warning/0 text-warning',
      danger: 'from-destructive/15 to-destructive/0 text-destructive',
      primary: 'from-primary/20 to-primary/0 text-primary',
    };
    return map[this.tone()];
  }

  positive() {
    return (this.delta() ?? 0) >= 0;
  }

  absDelta() {
    return Math.abs(this.delta() ?? 0);
  }
}
