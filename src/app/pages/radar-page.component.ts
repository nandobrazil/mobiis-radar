import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { customers } from '../data/mock-data';
import { RiskBadgeComponent, ScoreBarComponent } from '../shared/risk-badge.component';
import { TopBarComponent } from '../shared/top-bar.component';
import { formatDate, initials } from '../shared/ui-helpers';

const ALL = '__all__';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [RiskBadgeComponent, RouterLink, ScoreBarComponent, TopBarComponent],
  template: `
    <app-top-bar title="Radar de Clientes" [subtitle]="data().length + ' clientes filtrados'" />
    <main class="flex-1 space-y-4 p-4 md:p-6">
      <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div class="relative flex-1">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">⌕</span>
            <input
              [value]="q()"
              (input)="q.set($any($event.target).value)"
              placeholder="Buscar cliente..."
              class="h-10 w-full rounded-lg border border-border bg-background pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:flex">
            <select class="filter-select" [value]="seg()" (change)="seg.set($any($event.target).value)">
              <option [value]="ALL">Todos - Segmento</option>
              @for (option of segments; track option) { <option [value]="option">{{ option }}</option> }
            </select>
            <select class="filter-select" [value]="region()" (change)="region.set($any($event.target).value)">
              <option [value]="ALL">Todos - Regiao</option>
              @for (option of regions; track option) { <option [value]="option">{{ option }}</option> }
            </select>
            <select class="filter-select" [value]="seller()" (change)="seller.set($any($event.target).value)">
              <option [value]="ALL">Todos - Vendedor</option>
              @for (option of sellers; track option) { <option [value]="option">{{ option }}</option> }
            </select>
            <select class="filter-select" [value]="risk()" (change)="risk.set($any($event.target).value)">
              <option [value]="ALL">Todos - Risco</option>
              <option value="saudavel">Saudavel</option>
              <option value="atencao">Atencao</option>
              <option value="risco">Risco alto</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn-outline">Filtro avancado</button>
            <button class="btn-primary">Exportar</button>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th class="px-4 py-3 text-left font-medium">Cliente</th>
                <th class="px-4 py-3 text-left font-medium">Segmento</th>
                <th class="px-4 py-3 text-left font-medium">Produtos</th>
                <th class="px-4 py-3 text-left font-medium">Score</th>
                <th class="px-4 py-3 text-left font-medium">Tendencia</th>
                <th class="px-4 py-3 text-left font-medium">Risco</th>
                <th class="px-4 py-3 text-left font-medium">Ultima utilizacao</th>
                <th class="px-4 py-3 text-left font-medium">Potencial</th>
                <th class="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              @for (customer of data(); track customer.id) {
                <tr class="group transition-colors hover:bg-muted/20">
                  <td class="px-4 py-3">
                    <a [routerLink]="['/cliente', customer.id]" class="flex items-center gap-3">
                      <div class="grid h-9 w-9 place-items-center rounded-lg bg-accent text-xs font-semibold">{{ initials(customer.name) }}</div>
                      <div>
                        <div class="font-medium group-hover:text-primary">{{ customer.name }}</div>
                        <div class="text-xs text-muted-foreground">{{ customer.region }} - {{ customer.seller }}</div>
                      </div>
                    </a>
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">{{ customer.segment }}</td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      @for (product of customer.products.slice(0, 2); track product) {
                        <span class="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-normal">{{ product }}</span>
                      }
                      @if (customer.products.length > 2) {
                        <span class="rounded-md bg-muted px-2 py-0.5 text-[10px]">+{{ customer.products.length - 2 }}</span>
                      }
                    </div>
                  </td>
                  <td class="px-4 py-3"><app-score-bar [score]="customer.score" /></td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-1 text-xs font-medium" [class]="customer.trend >= 0 ? 'text-success' : 'text-destructive'">
                      {{ customer.trend >= 0 ? '↗' : '↘' }} {{ abs(customer.trend) }}%
                    </span>
                  </td>
                  <td class="px-4 py-3"><app-risk-badge [risk]="customer.risk" /></td>
                  <td class="px-4 py-3 text-xs text-muted-foreground">{{ formatDate(customer.lastUse) }}</td>
                  <td class="px-4 py-3">
                    <span class="rounded-md border px-2 py-0.5 text-xs" [class]="potentialClass(customer.potential)">{{ customer.potential }}</span>
                  </td>
                  <td class="px-4 py-3 text-xs capitalize text-muted-foreground">{{ customer.status }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `,
})
export class RadarPageComponent {
  protected readonly ALL = ALL;
  protected readonly q = signal('');
  protected readonly seg = signal(ALL);
  protected readonly risk = signal(ALL);
  protected readonly region = signal(ALL);
  protected readonly seller = signal(ALL);
  protected readonly initials = initials;
  protected readonly formatDate = formatDate;
  protected readonly abs = Math.abs;
  protected readonly segments = Array.from(new Set(customers.map((customer) => customer.segment)));
  protected readonly regions = Array.from(new Set(customers.map((customer) => customer.region)));
  protected readonly sellers = Array.from(new Set(customers.map((customer) => customer.seller)));

  protected readonly data = computed(() =>
    customers.filter((customer) =>
      (this.q() ? customer.name.toLowerCase().includes(this.q().toLowerCase()) : true) &&
      (this.seg() !== ALL ? customer.segment === this.seg() : true) &&
      (this.risk() !== ALL ? customer.risk === this.risk() : true) &&
      (this.region() !== ALL ? customer.region === this.region() : true) &&
      (this.seller() !== ALL ? customer.seller === this.seller() : true),
    ),
  );

  protected potentialClass(potential: string) {
    return potential === 'alto'
      ? 'bg-primary/15 text-primary border-primary/30'
      : potential === 'medio'
        ? 'bg-info/15 text-info border-info/30'
        : 'bg-muted text-muted-foreground border-border';
  }
}
