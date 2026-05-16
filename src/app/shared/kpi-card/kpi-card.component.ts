import { Component, input } from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import { LucideDynamicIcon, LucideTrendingDown, LucideTrendingUp } from '@lucide/angular';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [LucideDynamicIcon, LucideTrendingDown, LucideTrendingUp],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css',
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly delta = input<number>();
  readonly icon = input.required<LucideIconInput>();
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
