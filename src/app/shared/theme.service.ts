import { Injectable, computed, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'mobiis-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(readStoredTheme());
  readonly dark = computed(() => this.mode() === 'dark');

  constructor() {
    effect(() => {
      applyTheme(this.mode());
    });
  }

  toggle(): void {
    this.mode.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }
}

function readStoredTheme(): ThemeMode {
  if (typeof localStorage === 'undefined') {
    return 'dark';
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode);
  }
}
