import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { customers } from '../../data/mock-data';
import { TopBarComponent } from '../../shared/top-bar.component';
import { initials } from '../../shared/ui-helpers';

@Component({
  selector: 'app-insights-page',
  standalone: true,
  imports: [RouterLink, TopBarComponent],
  templateUrl: './insights-page.component.html',
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
