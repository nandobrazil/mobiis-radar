import { Component } from '@angular/core';

import { integrations } from '../data/mock-data';
import { TopBarComponent } from '../shared/top-bar.component';

@Component({
  selector: 'app-integracoes-page',
  standalone: true,
  imports: [TopBarComponent],
  template: `
    <app-top-bar title="Integracoes" subtitle="Fontes de dados conectadas a plataforma" />
    <main class="flex-1 space-y-4 p-4 md:p-6">
      <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div class="stat"><p>Conectadas</p><strong class="text-success">{{ connected }}</strong></div>
        <div class="stat"><p>Sincronizando</p><strong class="text-info">{{ syncing }}</strong></div>
        <div class="stat"><p>Com erro</p><strong class="text-destructive">{{ errors }}</strong></div>
        <div class="stat"><p>Total</p><strong class="text-primary">{{ integrations.length }}</strong></div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (item of integrations; track item.name) {
          <div class="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-elegant">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-primary">{{ icon(item.type) }}</div>
                <div>
                  <h3 class="text-sm font-semibold">{{ item.name }}</h3>
                  <p class="text-xs text-muted-foreground">{{ item.type }}</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium" [class]="statusClass(item.status)">
                {{ statusIcon(item.status) }} {{ statusLabel(item.status) }}
              </span>
            </div>
            <div class="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
              <span class="text-xs text-muted-foreground">Ultima sync: {{ item.last }}</span>
              <button class="h-7 rounded px-2 text-xs transition hover:bg-muted">Configurar</button>
            </div>
          </div>
        }

        <button class="grid place-items-center rounded-2xl border-2 border-dashed border-border bg-card/30 p-5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          <span class="mb-2 text-2xl">⌘</span>
          Adicionar nova integracao
        </button>
      </section>
    </main>
  `,
})
export class IntegracoesPageComponent {
  protected readonly integrations = integrations;
  protected readonly connected = integrations.filter((item) => item.status !== 'erro').length;
  protected readonly syncing = integrations.filter((item) => item.status === 'sincronizando').length;
  protected readonly errors = integrations.filter((item) => item.status === 'erro').length;

  protected icon(type: string) {
    return type === 'Database' ? '▤' : type === 'ERP' ? '▧' : type === 'Arquivo' ? '▦' : type === 'Webhook' ? '⎇' : '⌁';
  }

  protected statusClass(status: string) {
    return status === 'erro'
      ? 'text-destructive bg-destructive/15 border-destructive/30'
      : status === 'sincronizando'
        ? 'text-info bg-info/15 border-info/30'
        : 'text-success bg-success/15 border-success/30';
  }

  protected statusIcon(status: string) {
    return status === 'erro' ? '!' : status === 'sincronizando' ? '↻' : '✓';
  }

  protected statusLabel(status: string) {
    return status === 'erro' ? 'Erro' : status === 'sincronizando' ? 'Sincronizando' : status === 'atualizado' ? 'Atualizado' : 'Conectado';
  }
}
