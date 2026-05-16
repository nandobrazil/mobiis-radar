import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import type { LucideIconInput } from '@lucide/angular';
import {
  LucideBriefcase,
  LucideLayoutDashboard,
  LucideLineChart,
  LucideRadar,
  LucideSparkles,
  LucideTicket,
} from '@lucide/angular';

import { AppIconComponent } from './shared/app-icon/app-icon.component';
import { MenuService } from './shared/menu.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AppIconComponent],
  template: `
    <div class="font-sans flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-background">
      <aside
        class="fixed inset-y-0 left-0 z-40 flex h-dvh w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-out md:translate-x-0"
        [class.-translate-x-full]="!menu.open()"
      >
        <a routerLink="/" class="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div class="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-primary shadow-elegant">
            <app-icon [icon]="brandIcon" size="18" strokeWidth="2" svgClass="size-[18px] text-primary-foreground" />
            <span class="absolute inset-0 rounded-lg animate-pulse-ring"></span>
          </div>
          <div class="min-w-0 grid leading-tight">
            <span class="truncate text-sm font-semibold tracking-tight">Mobiis</span>
            <span class="-mt-0.5 truncate text-xs text-muted-foreground">Radar Platform</span>
          </div>
        </a>

        <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div>
            <p class="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Plataforma</p>
            @for (item of main; track item.url) {
              <a
                [routerLink]="item.url"
                routerLinkActive="bg-sidebar-accent text-sidebar-accent-foreground"
                [routerLinkActiveOptions]="{ exact: item.url === '/' }"
                class="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                (click)="menu.open.set(false)"
              >
                <span class="flex w-5 shrink-0 justify-center text-muted-foreground [.router-link-active_&]:text-sidebar-accent-foreground">
                  <app-icon [icon]="item.icon" size="18" strokeWidth="2" svgClass="shrink-0" />
                </span>
                <span class="truncate">{{ item.title }}</span>
              </a>
            }
          </div>
          <!-- <div>
            <p class="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Sistema</p>
            @for (item of config; track item.url) {
              <a
                [routerLink]="item.url"
                routerLinkActive="bg-sidebar-accent text-sidebar-accent-foreground"
                class="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                (click)="menu.open.set(false)"
              >
                <span class="w-5 shrink-0 text-center">{{ item.icon }}</span>
                <span class="truncate">{{ item.title }}</span>
              </a>
            }
          </div> -->
        </nav>

        <div class="shrink-0 border-t border-sidebar-border p-3">
          <div class="flex items-center gap-2 px-2 py-2">
            <div class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold">CS</div>
            <div class="min-w-0 grid leading-tight">
              <span class="truncate text-xs font-medium">Customer Success</span>
              <span class="truncate text-[10px] text-muted-foreground">cs@mobiis.com</span>
            </div>
          </div>
        </div>
      </aside>

      @if (menu.open()) {
        <button
          type="button"
          class="fixed inset-0 z-30 bg-black/40 md:hidden"
          (click)="menu.open.set(false)"
          aria-label="Fechar menu"
        ></button>
      }

      <main class="flex min-h-0 flex-1 flex-col overflow-hidden md:pl-60">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  protected readonly menu = inject(MenuService);
  protected readonly brandIcon = LucideRadar;
  readonly main: { title: string; url: string; icon: LucideIconInput }[] = [
    { title: 'Dashboard', url: '/', icon: LucideLayoutDashboard },
    { title: 'Radar de Clientes', url: '/radar', icon: LucideRadar },
    { title: 'Comercial', url: '/comercial', icon: LucideBriefcase },
    { title: 'Executivo', url: '/executivo', icon: LucideLineChart },
    { title: 'Insights IA', url: '/insights', icon: LucideSparkles },
    { title: 'Movidesk', url: '/movidesk', icon: LucideTicket },
  ];
  readonly config = [
  ];
}
