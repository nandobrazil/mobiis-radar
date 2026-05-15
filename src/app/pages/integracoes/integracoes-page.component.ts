import { Component } from '@angular/core';

import { integrations } from '../../data/mock-data';
import { TopBarComponent } from '../../shared/top-bar.component';

@Component({
  selector: 'app-integracoes-page',
  standalone: true,
  imports: [TopBarComponent],
  templateUrl: './integracoes-page.component.html',
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
