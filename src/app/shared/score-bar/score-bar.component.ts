import { Component, input } from '@angular/core';

import { scoreTone } from '../ui-helpers';

@Component({
  selector: 'app-score-bar',
  standalone: true,
  templateUrl: './score-bar.component.html',
  styleUrl: './score-bar.component.css',
})
export class ScoreBarComponent {
  readonly score = input.required<number>();

  tone() {
    return scoreTone(this.score());
  }
}
