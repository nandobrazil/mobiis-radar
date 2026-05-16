import { Component, inject, input } from '@angular/core';
import { LucideBell, LucideMenu, LucideMoon, LucideSearch, LucideSun } from '@lucide/angular';

import { MenuService } from '../menu.service';
import { ThemeService } from '../theme.service';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  protected readonly menu = inject(MenuService);
  protected readonly theme = inject(ThemeService);
  protected readonly iconMenu = LucideMenu;
  protected readonly iconSearch = LucideSearch;
  protected readonly iconSun = LucideSun;
  protected readonly iconMoon = LucideMoon;
  protected readonly iconBell = LucideBell;
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
