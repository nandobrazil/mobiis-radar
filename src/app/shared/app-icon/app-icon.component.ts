import { Component, input } from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import { LucideDynamicIcon } from '@lucide/angular';

/**
 * Ícone Lucide genérico: recebe a referência do ícone (`LucideXxx`), tamanho e classes no SVG.
 * Centraliza `LucideDynamicIcon` + `[lucideIcon]` para manter templates consistentes.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  template: `
    <svg
      [lucideIcon]="icon()"
      [size]="size()"
      [strokeWidth]="strokeWidth()"
      [class]="svgClass()"
    />
  `,
})
export class AppIconComponent {
  readonly icon = input.required<LucideIconInput>();
  /** Largura/altura no Lucide (px ou string CSS aceita pelo pacote). */
  readonly size = input<number | string>(18);
  readonly strokeWidth = input<number | string>(2);
  /** Classes Tailwind/CSS aplicadas ao elemento SVG (ex.: `size-4 shrink-0 text-primary`). */
  readonly svgClass = input<string>('');
}
