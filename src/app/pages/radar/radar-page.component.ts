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
import { RelatorioProcessamentoBannerComponent } from '../../shared/relatorio-processamento-banner/relatorio-processamento-banner.component';

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
    RelatorioProcessamentoBannerComponent,
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
  protected readonly cnae = signal(ALL);
  protected readonly cnaeOptions = computed(() => {
    const items = this.relatorio.items();
    const set = new Set<string>();
    items.forEach(r => {
      const desc = r.owner?.cnae_fiscal_descricao;
      if (desc) set.add(desc);
    });
    const opts = Array.from(set).sort().map(v => ({ label: v, value: v }));
    return [{ label: 'Todos - Segmentos', value: ALL }, ...opts];
  });
  protected readonly perfil = signal(ALL);
  protected readonly perfilOptions = computed(() => {
    const items = this.relatorio.items();
    const set = new Set<string>();
    items.forEach(r => {
      const p = r.analise?.perfil_uso;
      if (p) set.add(p);
    });
    const opts = Array.from(set).sort().map(v => ({ label: v, value: v }));
    return [{ label: 'Todos - Perfis', value: ALL }, ...opts];
  });

  protected readonly filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const r = this.risk();
    const c = this.cnae();
    const p = this.perfil();
    return this.relatorio.items().filter((row) => {
      if (!row?.cliente) return false;
      const name = (row.owner?.nome || row.cliente.nome_cliente || '').toLowerCase();
      const id = (row.owner?.id || row.cliente.owner_id || '').toLowerCase();
      const matchQ = !q || name.includes(q) || id.includes(q);
      
      const riskVal = row.analise ? normalizeNivelRisco(row.analise.nivel_risco) : null;
      const matchRisk = r === ALL || riskVal === r;
      
      const cnaeVal = row.owner?.cnae_fiscal_descricao;
      const matchCnae = c === ALL || cnaeVal === c;

      const perfilVal = row.analise?.perfil_uso;
      const matchPerfil = p === ALL || perfilVal === p;
      
      return matchQ && matchRisk && matchCnae && matchPerfil;
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

  protected onRiskFilterChange(value: string | null): void {
    this.risk.set(value || ALL);
  }

  protected onCnaeFilterChange(value: string | null): void {
    this.cnae.set(value || ALL);
  }

  protected selectSegment(segment: string) {
    this.cnae.set(segment);
    this.activeTab.set('list');
  }

  protected onPerfilFilterChange(value: string | null): void {
    this.perfil.set(value || ALL);
  }
}
