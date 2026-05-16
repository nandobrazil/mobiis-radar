import { Component } from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import {
  LucideBuilding2,
  LucideCheck,
  LucideDatabase,
  LucideFileStack,
  LucideLoader2,
  LucidePlug,
  LucidePlusCircle,
  LucideTriangleAlert,
  LucideWebhook,
} from '@lucide/angular';

import { integrations } from '../../data/mock-data';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';

@Component({
  selector: 'app-integracoes-page',
  standalone: true,
  imports: [AppIconComponent, TopBarComponent],
  templateUrl: './integracoes-page.component.html',
})
export class IntegracoesPageComponent {
  protected readonly iconPlus = LucidePlusCircle;
  protected readonly integrations = integrations;
  protected readonly connected = integrations.filter((item) => item.status !== 'erro').length;
  protected readonly syncing = integrations.filter((item) => item.status === 'sincronizando').length;
  protected readonly errors = integrations.filter((item) => item.status === 'erro').length;

  protected typeIcon(type: string): LucideIconInput {
    if (type === 'Database') return LucideDatabase;
    if (type === 'ERP') return LucideBuilding2;
    if (type === 'Arquivo') return LucideFileStack;
    if (type === 'Webhook') return LucideWebhook;
    return LucidePlug;
  }

  protected statusClass(status: string) {
    return status === 'erro'
      ? 'text-destructive bg-destructive/15 border-destructive/30'
      : status === 'sincronizando'
        ? 'text-info bg-info/15 border-info/30'
        : 'text-success bg-success/15 border-success/30';
  }

  protected statusIcon(status: string): LucideIconInput {
    return status === 'erro' ? LucideTriangleAlert : status === 'sincronizando' ? LucideLoader2 : LucideCheck;
  }

  protected statusIconSvgClass(status: string): string {
    return status === 'sincronizando' ? 'shrink-0 animate-spin' : 'shrink-0';
  }

  protected statusLabel(status: string) {
    return status === 'erro' ? 'Erro' : status === 'sincronizando' ? 'Sincronizando' : status === 'atualizado' ? 'Atualizado' : 'Conectado';
  }
}
