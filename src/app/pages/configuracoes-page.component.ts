import { Component, signal } from '@angular/core';

import { TopBarComponent } from '../shared/top-bar.component';

@Component({
  selector: 'app-configuracoes-page',
  standalone: true,
  imports: [TopBarComponent],
  template: `
    <app-top-bar title="Configuracoes" subtitle="Ajustes da plataforma e da equipe" />
    <main class="flex-1 space-y-4 p-4 md:p-6">
      <section class="section">
        <div class="mb-5">
          <h3 class="text-sm font-semibold">Workspace</h3>
          <p class="text-xs text-muted-foreground">Configuracoes gerais da sua organizacao</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="field">Nome do workspace<input value="Mobiis Tecnologia" /></label>
          <label class="field">Dominio<input value="mobiis.com" /></label>
          <label class="field">Fuso horario<input value="America/Sao_Paulo" /></label>
          <label class="field">Moeda padrao<input value="BRL - Real" /></label>
        </div>
      </section>

      <section class="section">
        <div class="mb-5">
          <h3 class="text-sm font-semibold">Alertas inteligentes</h3>
          <p class="text-xs text-muted-foreground">Defina quando a Mobiis AI deve notificar sua equipe</p>
        </div>
        @for (toggle of toggles; track toggle.title) {
          <div class="flex items-center justify-between border-b border-border/50 py-3 last:border-b-0">
            <div>
              <p class="text-sm font-medium">{{ toggle.title }}</p>
              <p class="text-xs text-muted-foreground">{{ toggle.desc }}</p>
            </div>
            <button
              type="button"
              class="relative h-6 w-11 rounded-full border border-border transition"
              [class.bg-primary]="toggle.checked()"
              [class.bg-muted]="!toggle.checked()"
              (click)="toggle.checked.set(!toggle.checked())"
            >
              <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white transition" [class.left-5]="toggle.checked()" [class.left-0.5]="!toggle.checked()"></span>
            </button>
          </div>
        }
      </section>

      <section class="section">
        <div class="mb-5">
          <h3 class="text-sm font-semibold">API & Webhooks</h3>
          <p class="text-xs text-muted-foreground">Tokens para integracoes externas</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="field">API Key<input value="mob_live_**********3f29" /></label>
          <label class="field">Webhook URL<input value="https://api.mobiis.com/v1/events" /></label>
        </div>
        <div class="mt-3 flex gap-2">
          <button class="btn-outline">Regenerar token</button>
          <button class="btn-primary">Salvar alteracoes</button>
        </div>
      </section>
    </main>
  `,
})
export class ConfiguracoesPageComponent {
  protected readonly toggles = [
    { title: 'Cliente entrar em risco alto', desc: 'Notifica CS responsavel imediatamente', checked: signal(true) },
    { title: 'Score cair mais de 15 pontos em 30 dias', desc: 'Envia alerta no Slack do time', checked: signal(true) },
    { title: 'Cliente sem uso por 15 dias', desc: 'Sugere acao de reengajamento', checked: signal(true) },
    { title: 'Oportunidade de upsell detectada', desc: 'Notifica vendedor responsavel', checked: signal(false) },
  ];
}
