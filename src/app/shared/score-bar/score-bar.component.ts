import { Component, computed, input } from '@angular/core';

import { healthScoreBarBackground, healthScoreTextColor } from '../ui-helpers';

@Component({
  selector: 'app-score-bar',
  standalone: true,
  templateUrl: './score-bar.component.html',
  styleUrl: './score-bar.component.css',
})
export class ScoreBarComponent {
  readonly score = input.required<number>();

  protected readonly barBackground = computed(() => healthScoreBarBackground(this.score()));
  protected readonly valueColor = computed(() => healthScoreTextColor(this.score()));
}
