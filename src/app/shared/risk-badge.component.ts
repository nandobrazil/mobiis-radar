import { Component, input } from '@angular/core';

import { RiskLevel } from '../data/mock-data';
import { riskClasses, riskLabel, scoreTone } from './ui-helpers';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium" [class]="classes()">
      <span class="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></span>
      {{ label() }}
    </span>
  `,
})
export class RiskBadgeComponent {
  readonly risk = input.required<RiskLevel>();

  label() {
    return riskLabel(this.risk());
  }

  classes() {
    return riskClasses(this.risk());
  }
}

@Component({
  selector: 'app-score-bar',
  standalone: true,
  template: `
    <div class="flex items-center gap-2">
      <div class="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div class="h-full rounded-full" [class]="tone()" [style.width.%]="score()"></div>
      </div>
      <span class="w-8 text-right text-xs font-medium tabular-nums">{{ score() }}</span>
    </div>
  `,
})
export class ScoreBarComponent {
  readonly score = input.required<number>();

  tone() {
    return scoreTone(this.score());
  }
}
