import { Component, input } from '@angular/core';

import { RiskLevel } from '../../data/mock-data';
import { riskClasses, riskLabel } from '../ui-helpers';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  templateUrl: './risk-badge.component.html',
  styleUrl: './risk-badge.component.css',
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
