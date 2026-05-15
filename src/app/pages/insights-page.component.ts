import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { customers } from '../data/mock-data';
import { TopBarComponent } from '../shared/top-bar.component';
import { initials } from '../shared/ui-helpers';

@Component({
  selector: 'app-insights-page',
  standalone: true,
  imports: [RouterLink, TopBarComponent],
  template: `
    <app-top-bar title="Mobiis AI Insights" subtitle="Recomendacoes geradas por inteligencia artificial" />
    <main class="flex-1 space-y-6 p-4 md:p-6">
      <section class="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-6 shadow-elegant">
        <div class="absolute inset-0 bg-grid opacity-30"></div>
        <div class="absolute -right-20 -top-32 h-72 w-[520px] rounded-full bg-gradient-primary opacity-25 blur-3xl"></div>
        <div class="relative flex items-center gap-4">
          <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-elegant">
            <span class="text-2xl text-primary-foreground">✦</span>
          </div>
          <div>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              Analise continua
            </span>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight">
              A IA processou <span class="text-gradient">{{ customers.length }} clientes</span> e gerou {{ insights.length }} insights estrategicos
            </h2>
            <p class="text-sm text-muted-foreground">Ultima atualizacao ha 4 minutos</p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
        @for (insight of insights; track insight.title) {
          <div class="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card" [class]="insight.border">
            <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent" [class]="insight.tint"></div>
            <div class="relative">
              <div class="flex items-center gap-3">
                <span class="grid h-10 w-10 place-items-center rounded-lg" [class]="insight.iconTone">{{ insight.icon }}</span>
                <h3 class="text-base font-semibold">{{ insight.title }}</h3>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ insight.body }}</p>
              <button class="mt-4 inline-flex items-center gap-1 rounded-lg px-0 py-2 text-sm text-primary">
                {{ insight.cta }} <span>→</span>
              </button>
            </div>
          </div>
        }
      </section>

      <section class="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 class="text-sm font-semibold">Acoes priorizadas pela IA</h3>
        <p class="text-xs text-muted-foreground">Clientes que requerem atuacao imediata</p>
        <div class="mt-4 divide-y divide-border">
          @for (customer of featured; track customer.id) {
            <a [routerLink]="['/cliente', customer.id]" class="-mx-2 flex items-center gap-3 rounded-md px-2 py-3 hover:bg-muted/30">
              <div class="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary text-xs font-semibold text-primary-foreground">
                {{ initials(customer.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ customer.name }}</p>
                <p class="text-xs text-muted-foreground">
                  Probabilidade de churn em 60 dias: <span class="font-medium text-destructive">{{ max(60, 100 - customer.score) }}%</span>
                </p>
              </div>
              <span class="rounded-lg border border-border px-3 py-1.5 text-xs">Abrir plano</span>
            </a>
          }
        </div>
      </section>
    </main>
  `,
})
export class InsightsPageComponent {
  protected readonly customers = customers;
  protected readonly initials = initials;
  protected readonly max = Math.max;
  protected readonly featured = customers.filter((customer) => customer.risk === 'risco').slice(0, 5);
  protected readonly insights = [
    {
      icon: '!',
      title: 'Risco crescente no segmento Logistica 3PL',
      body: 'Detectamos 4 clientes com queda media de 22% na utilizacao da Torre de Controle nos ultimos 14 dias.',
      cta: 'Ver clientes afetados',
      border: 'border-destructive/30',
      tint: 'from-destructive/15',
      iconTone: 'text-destructive bg-destructive/15',
    },
    {
      icon: '✦',
      title: 'Oportunidade de cross-sell em Varejo',
      body: '12 clientes do segmento Varejo possuem perfil aderente ao modulo Analytics+ com ROI estimado em 45 dias.',
      cta: 'Gerar lista comercial',
      border: 'border-primary/30',
      tint: 'from-primary/15',
      iconTone: 'text-primary bg-primary/15',
    },
    {
      icon: '◌',
      title: 'Padrao de churn identificado',
      body: 'Clientes com score abaixo de 50 e sem uso por 18+ dias apresentam 78% de probabilidade de cancelamento em 60 dias.',
      cta: 'Aplicar playbook CS',
      border: 'border-info/30',
      tint: 'from-info/15',
      iconTone: 'text-info bg-info/15',
    },
    {
      icon: '◎',
      title: 'Expansao recomendada',
      body: '8 clientes saudaveis com 3+ produtos ativos demonstram aderencia para upgrade de plano enterprise.',
      cta: 'Ver oportunidades',
      border: 'border-success/30',
      tint: 'from-success/15',
      iconTone: 'text-success bg-success/15',
    },
  ];
}
