import { Component } from '@angular/core';
import { LucideCalendarX, LucideTarget, LucideTrendingDown, LucideTrendingUp } from '@lucide/angular';

import { customers } from '../../data/mock-data';
import { GeoMapComponent } from '../../shared/geo-map/geo-map.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';

@Component({
  selector: 'app-comercial-page',
  standalone: true,
  imports: [GeoMapComponent, TopBarComponent],
  templateUrl: './comercial-page.component.html',
})
export class ComercialPageComponent {
  private readonly semelhantes = customers.filter((customer) => customer.potential === 'alto' && customer.risk !== 'risco').slice(0, 4);
  private readonly expansao = customers.filter((customer) => customer.score >= 70 && customer.potential !== 'baixo').slice(0, 4);
  private readonly baixaAdocao = [...customers].sort((a, b) => a.score - b.score).slice(0, 4);
  private readonly semUso = customers.filter((customer) => Date.now() - new Date(customer.lastUse).getTime() > 15 * 86400000).slice(0, 4);

  protected readonly cards = [
    { icon: LucideTarget, title: 'Perfil semelhante', text: 'text-primary', tint: 'from-primary/15', description: 'Clientes com padrão operacional parecido', list: this.semelhantes },
    { icon: LucideTrendingUp, title: 'Prontos para expansão', text: 'text-success', tint: 'from-success/15', description: 'Score alto e produtos complementares', list: this.expansao },
    { icon: LucideTrendingDown, title: 'Baixa adoção', text: 'text-warning', tint: 'from-warning/15', description: 'Risco de não atingir valor', list: this.baixaAdocao },
    { icon: LucideCalendarX, title: 'Sem uso há 15+ dias', text: 'text-destructive', tint: 'from-destructive/15', description: 'Necessitam reengajamento imediato', list: this.semUso },
  ];
}
