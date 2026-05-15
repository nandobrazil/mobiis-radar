import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'mapa-clientes-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mode = signal<ThemeMode>(this.readInitialMode());
  readonly isDark = computed(() => this.mode() === 'dark');
  readonly toggleIcon = computed(() => (this.isDark() ? 'light_mode' : 'dark_mode'));
  readonly toggleLabel = computed(() =>
    this.isDark() ? 'Ativar modo claro' : 'Ativar modo escuro',
  );

  constructor() {
    this.applyTheme(this.mode());
  }

  toggle(): void {
    this.setMode(this.isDark() ? 'light' : 'dark');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.applyTheme(mode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }

  private applyTheme(mode: ThemeMode): void {
    const root = this.document.documentElement;
    root.dataset['theme'] = mode;
    root.style.colorScheme = mode;
  }

  private readInitialMode(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
