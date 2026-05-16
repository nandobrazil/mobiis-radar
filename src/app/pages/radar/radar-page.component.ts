import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RelatorioClientesService } from '../../shared/relatorio-clientes.service';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { KpiCardSkeletonComponent } from '../../shared/kpi-card-skeleton/kpi-card-skeleton.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import {
  LucideAlertTriangle,
  LucideUsersRound,
} from '@lucide/angular';
import { RadarListComponent } from './screens/radar-list/radar-list.component';
import { RadarSegmentsComponent } from './screens/radar-segments/radar-segments.component';
import { RadarMapComponent } from './screens/radar-map/radar-map.component';

type RadarTab = 'list' | 'segments' | 'map';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [
    KpiCardComponent,
    KpiCardSkeletonComponent,
    TopBarComponent,
    RadarListComponent,
    RadarSegmentsComponent,
    RadarMapComponent,
  ],
  templateUrl: './radar-page.component.html',
})
export class RadarPageComponent implements OnInit {
  protected readonly relatorio = inject(RelatorioClientesService);
  protected readonly activeTab = signal<RadarTab>('list');

  protected readonly subtitle = computed(() => {
    const total = this.relatorio.items().length;
    if (this.activeTab() === 'list') {
       return `Visualizando lista de clientes (${total})`;
    }
    if (this.activeTab() === 'segments') {
      return 'Distribuição por segmentos';
    }
    return 'Distribuição geográfica';
  });

  protected readonly stats = computed(() => this.relatorio.stats());
  protected readonly kpiSkeletonSlots = [0, 1] as const;

  protected readonly iconUsers = LucideUsersRound;
  protected readonly iconAlertHigh = LucideAlertTriangle;

  protected pct(count: number): string {
    const total = this.stats().total;
    if (!total) return '';
    return `${Math.round((count / total) * 100)}% da carteira`;
  }

  ngOnInit(): void {
    this.relatorio.load();
  }

  protected setTab(tab: RadarTab): void {
    this.activeTab.set(tab);
  }
}
