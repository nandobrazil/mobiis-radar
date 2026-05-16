import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RelatorioClientesService, normalizeNivelRisco } from '../../shared/relatorio-clientes.service';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { KpiCardSkeletonComponent } from '../../shared/kpi-card-skeleton/kpi-card-skeleton.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  LucideAlertTriangle,
  LucideUsersRound,
  LucideSearch,
} from '@lucide/angular';
import { RadarListComponent } from './screens/radar-list/radar-list.component';
import { RadarSegmentsComponent } from './screens/radar-segments/radar-segments.component';
import { RadarMapComponent } from './screens/radar-map/radar-map.component';

type RadarTab = 'list' | 'segments' | 'map';
const ALL = '__all__';

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
    AppIconComponent,
    FormsModule,
    NgSelectComponent,
  ],
  templateUrl: './radar-page.component.html',
})
export class RadarPageComponent implements OnInit {
  protected readonly relatorio = inject(RelatorioClientesService);
  protected readonly activeTab = signal<RadarTab>('list');
  protected readonly iconSearch = LucideSearch;

  protected readonly ALL = ALL;
  protected readonly q = signal('');
  protected readonly risk = signal(ALL);
  protected readonly riskFilterOptions: { label: string; value: string }[] = [
    { label: 'Todos - Risco', value: ALL },
    { label: 'Alto', value: 'ALTO' },
    { label: 'Médio', value: 'MEDIO' },
    { label: 'Baixo', value: 'BAIXO' },
  ];

  protected readonly filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const r = this.risk();
    return this.relatorio.items().filter((row) => {
      if (!row?.cliente) return false;
      const name = row.cliente.nome_cliente.toLowerCase();
      const matchQ = !q || name.includes(q) || row.cliente.owner_id.toLowerCase().includes(q);
      if (r === ALL) return matchQ;
      if (!row.analise) return false;
      const nr = normalizeNivelRisco(row.analise.nivel_risco);
      return matchQ && nr === r;
    });
  });

  protected readonly subtitle = computed(() => {
    const n = this.filtered().length;
    const total = this.relatorio.items().length;
    if (this.activeTab() === 'list') {
       return `${n} de ${total} clientes filtrados`;
    }
    if (this.activeTab() === 'segments') {
      return `Distribuição por segmentos (${n} clientes)`;
    }
    return `Distribuição geográfica (${n} clientes)`;
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
    if (this.relatorio.items().length === 0) {
      this.relatorio.load();
    }
  }

  protected setTab(tab: RadarTab): void {
    this.activeTab.set(tab);
  }

  protected onRiskFilterChange(value: string): void {
    this.risk.set(value);
  }
}
