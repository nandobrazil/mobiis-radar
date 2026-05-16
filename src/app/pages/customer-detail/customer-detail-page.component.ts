import { Component, OnDestroy, OnInit, computed, effect, inject, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import type { RelatorioTop20Item } from '../../data/top20.types';
import { allProducts, customers, usageSeries } from '../../data/mock-data';
import { healthScoreFromRelatorioRow, RadarTop20Service } from '../../shared/radar-top20.service';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import { LineChartComponent } from '../../shared/line-chart/line-chart.component';
import { ScoreBarComponent } from '../../shared/score-bar/score-bar.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { formatDate, initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [JsonPipe, LineChartComponent, RiskBadgeComponent, RouterLink, ScoreBarComponent, TopBarComponent],
  templateUrl: './customer-detail-page.component.html',
})
export class CustomerDetailPageComponent implements OnInit, OnDestroy {
  readonly id = input<string>();

  protected readonly top20 = inject(RadarTop20Service);
  protected readonly customers = customers;
  protected readonly usageSeries = usageSeries;
  protected readonly initials = initials;
  protected readonly formatDate = formatDate;
  protected readonly abs = Math.abs;
  protected readonly usageSeriesConfig = [
    { key: 'rotas', color: 'oklch(0.65 0.20 255)' },
    { key: 'torre', color: 'oklch(0.65 0.22 295)' },
    { key: 'planner', color: 'oklch(0.78 0.15 200)' },
  ];
  protected readonly incidents = [
    { d: '12/05', t: 'Atraso na sincronizacao ERP', dot: 'bg-warning' },
    { d: '03/05', t: 'Queda de 12% nas operacoes de roteirizacao', dot: 'bg-destructive' },
    { d: '21/04', t: 'Onboarding do produto Planner concluido', dot: 'bg-success' },
    { d: '08/04', t: 'Webhook de eventos reconfigurado', dot: 'bg-info' },
  ];

  protected readonly report = computed(() => {
    const idVal = this.id();
    return idVal ? this.top20.itemByOwnerId(idVal) : undefined;
  });

  /** Detalle API so exibido quando corresponde ao cliente da rota. */
  protected readonly detalleOperacional = computed(() => {
    const d = this.top20.clienteDetalle();
    const idVal = this.id();
    if (!d || !idVal) {
      return undefined;
    }
    return d.owner_id.trim().toLowerCase() === idVal.trim().toLowerCase() ? d : undefined;
  });

  protected readonly customer = computed(() =>
    customers.find((customerItem) => customerItem.id === this.id()),
  );

  protected readonly segmentAvg = computed(() => {
    const c = this.customer();
    if (!c) return 0;
    const segmentCustomers = customers.filter((item) => item.segment === c.segment);
    return Math.round(segmentCustomers.reduce((sum, item) => sum + item.score, 0) / segmentCustomers.length);
  });

  protected readonly radarData = computed(() => {
    const c = this.customer();
    if (!c) return [];
    const segmentAvgVal = this.segmentAvg();
    return [
      { dim: 'Adocao', v: c.score, ref: segmentAvgVal },
      { dim: 'Frequencia', v: Math.min(100, c.score + 5), ref: segmentAvgVal },
      { dim: 'Engajamento', v: Math.max(0, c.score - 8), ref: segmentAvgVal - 4 },
      { dim: 'Estabilidade', v: Math.min(100, c.score + 12), ref: segmentAvgVal + 2 },
      { dim: 'Suporte', v: Math.max(0, c.score - 4), ref: segmentAvgVal + 6 },
      { dim: 'Expansao', v: c.potential === 'alto' ? 88 : c.potential === 'medio' ? 60 : 30, ref: 55 },
    ];
  });

  protected readonly unused = computed(() => {
    const c = this.customer();
    if (!c) return [];
    return allProducts.filter((product) => !c.products.includes(product)).slice(0, 4);
  });

  ngOnInit(): void {
    if (this.id() && !this.top20.loading() && this.top20.items().length === 0) {
      this.top20.load();
    }
  }

  ngOnDestroy(): void {
    this.top20.clearClienteDetalle();
  }

  constructor() {
    effect(() => {
      const r = this.report();
      if (r?.cliente.owner_id) {
        this.top20.fetchClienteDetalle(r.cliente.owner_id);
      } else {
        this.top20.clearClienteDetalle();
      }
    });
  }

  protected riskFromReport(row: RelatorioTop20Item) {
    return nivelRiscoToRiskLevel(row.analise?.nivel_risco);
  }

  protected healthFromReport(row: RelatorioTop20Item): number {
    return healthScoreFromRelatorioRow(row);
  }

  protected kpis(row: RelatorioTop20Item) {
    const c = row.cliente;
    return [
      { label: 'Dias sem uso', value: String(c.dias_sem_atividade) },
      { label: 'Acoes 30d', value: String(c.acoes_30d) },
      { label: 'Acoes 90d', value: String(c.acoes_90d) },
      { label: 'Usuarios ativos', value: String(c.usuarios_ativos) },
      { label: 'Core 30d / 90d', value: `${c.acoes_core_30d} / ${c.acoes_core_90d}` },
      { label: 'Entidades', value: String(c.entidades_utilizadas) },
      { label: 'Acoes neg. 30d', value: String(c.acoes_negativas_30d) },
      { label: 'Automacao 30d', value: String(c.acoes_automatizadas_30d) },
    ];
  }

  protected formatIso(iso: string | null): string {
    if (!iso) {
      return '—';
    }
    try {
      return new Date(iso).toLocaleString('pt-BR');
    } catch {
      return iso;
    }
  }

  protected aiSections(c: { score: number; potential: string }) {
    const firstUnused = this.unused()[0] ?? 'Analytics+';
    return [
      { icon: '!', title: 'Risco de churn', tone: 'bg-destructive/10 text-destructive border-destructive/30', body: `Probabilidade estimada de <strong>${Math.max(5, 100 - c.score)}%</strong> nos proximos 60 dias.` },
      { icon: '◌', title: 'Recomendacao para CS', tone: 'bg-info/10 text-info border-info/30', body: 'Agendar QBR com sponsor + revisar SLA da Torre de Controle.' },
      { icon: '✦', title: 'Recomendacao comercial', tone: 'bg-primary/10 text-primary border-primary/30', body: `Apresentar pacote ${firstUnused} com piloto de 30 dias.` },
      { icon: '⚙', title: 'Acoes preventivas', tone: 'bg-warning/10 text-warning border-warning/30', body: 'Reativar webhook de eventos e reforcar treinamento do Planner.' },
      { icon: '↯', title: 'Produtos aderentes', tone: 'bg-primary/10 text-primary border-primary/30', body: this.unused().slice(0, 3).join(' - ') },
    ];
  }
}
