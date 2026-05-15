import { Component, signal } from '@angular/core';

import { TopBarComponent } from '../../shared/top-bar.component';

@Component({
  selector: 'app-configuracoes-page',
  standalone: true,
  imports: [TopBarComponent],
  templateUrl: './configuracoes-page.component.html',
})
export class ConfiguracoesPageComponent {
  protected readonly toggles = [
    { title: 'Cliente entrar em risco alto', desc: 'Notifica CS responsavel imediatamente', checked: signal(true) },
    { title: 'Score cair mais de 15 pontos em 30 dias', desc: 'Envia alerta no Slack do time', checked: signal(true) },
    { title: 'Cliente sem uso por 15 dias', desc: 'Sugere acao de reengajamento', checked: signal(true) },
    { title: 'Oportunidade de upsell detectada', desc: 'Notifica vendedor responsavel', checked: signal(false) },
  ];
}
