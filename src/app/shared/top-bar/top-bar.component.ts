import { Component, inject, input } from '@angular/core';

import { MenuService } from '../menu.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  protected readonly menu = inject(MenuService);
  protected readonly theme = inject(ThemeService);
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
