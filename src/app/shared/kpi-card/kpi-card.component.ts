import { Component, input } from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import { LucideTrendingDown, LucideTrendingUp } from '@lucide/angular';

import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [AppIconComponent],
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

  /** Faixa superior do card (gradiente). */
  toneGradientClass(): string {
    const map = {
      default: 'from-muted/55 to-transparent',
      success: 'from-success/28 to-transparent',
      warning: 'from-warning/38 to-transparent',
      danger: 'from-destructive/28 to-transparent',
      primary: 'from-primary/32 to-transparent',
    };
    return map[this.tone()];
  }

  /** Ícone: texto e fundo/borda com contraste legível sobre o card. */
  toneIconClass(): string {
    const map = {
      default: 'text-foreground border-foreground/20 bg-muted',
      success: 'text-success border-success/40 bg-success/16',
      warning: 'text-warning-foreground border-warning/50 bg-warning/24',
      danger: 'text-destructive border-destructive/40 bg-destructive/14',
      primary: 'text-primary border-primary/40 bg-primary/16',
    };
    return map[this.tone()];
  }

  positive() {
    return (this.delta() ?? 0) >= 0;
  }

  absDelta() {
    return Math.abs(this.delta() ?? 0);
  }

  protected readonly trendUp = LucideTrendingUp;
  protected readonly trendDown = LucideTrendingDown;
}
