import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  LucideCircleDashed,
  LucideSparkles,
  LucideTriangleAlert,
} from '@lucide/angular';
import { finalize } from 'rxjs/operators';

import type {
  RelatorioInsightItem,
  RelatorioInsightTipo,
  RelatorioInsightsResponse,
} from '../../data/relatorio-insights.types';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import {
  persistInsightsGeradoEmDia,
  shouldFetchInsightsNoCache,
} from '../../shared/relatorio-insights-cache';
import { RelatorioClientesService } from '../../shared/relatorio-clientes.service';
import { RiskBadgeComponent } from '../../shared/risk-badge/risk-badge.component';
import { InsightsPageSkeletonComponent } from '../../shared/insights-page-skeleton/insights-page-skeleton.component';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { initials, nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

interface InsightCardUi {
  icon: typeof LucideTriangleAlert | typeof LucideSparkles | typeof LucideCircleDashed;
  border: string;
  tint: string;
  iconTone: string;
  tipoLabel: string;
}

const INSIGHT_UI: Record<RelatorioInsightTipo, InsightCardUi> = {
  RISCO: {
    icon: LucideTriangleAlert,
    border: 'border-destructive/30',
    tint: 'from-destructive/15',
    iconTone: 'text-destructive bg-destructive/15',
    tipoLabel: 'Risco',
  },
  OPORTUNIDADE: {
    icon: LucideSparkles,
    border: 'border-primary/30',
    tint: 'from-primary/15',
    iconTone: 'text-primary bg-primary/15',
    tipoLabel: 'Oportunidade',
  },
  PADRAO: {
    icon: LucideCircleDashed,
    border: 'border-info/30',
    tint: 'from-info/15',
    iconTone: 'text-info bg-info/15',
    tipoLabel: 'Padrão',
  },
};

function isOwnerUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
}

@Component({
  selector: 'app-insights-page',
  standalone: true,
  imports: [
    AppIconComponent,
    DataTableComponent,
    InsightsPageSkeletonComponent,
    RiskBadgeComponent,
    RouterLink,
    TopBarComponent,
  ],
  templateUrl: './insights-page.component.html',
})
export class InsightsPageComponent implements OnInit {
  private readonly relatorio = inject(RelatorioClientesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly iconHero = LucideSparkles;
  protected readonly initials = initials;

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly data = signal<RelatorioInsightsResponse | null>(null);

  protected readonly insights = computed(() => this.data()?.insights ?? []);
  protected readonly acoesPriorizadas = computed(() => this.data()?.acoes_priorizadas ?? []);
  protected readonly totalClientes = computed(() => this.data()?.total_clientes_analisados ?? 0);

  protected readonly geradoEmFormatado = computed(() => {
    const raw = this.data()?.gerado_em;
    if (!raw) {
      return null;
    }
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) {
      return raw;
    }
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  });

  ngOnInit(): void {
    this.carregar();
  }

  protected recarregar(): void {
    this.carregar(true);
  }

  protected uiInsight(insight: RelatorioInsightItem): InsightCardUi {
    const tipo = (insight.tipo ?? 'PADRAO').toUpperCase() as RelatorioInsightTipo;
    return INSIGHT_UI[tipo] ?? INSIGHT_UI.PADRAO;
  }

  protected riskLevel(nivel: string) {
    return nivelRiscoToRiskLevel(nivel);
  }

  protected isOwnerUuid = isOwnerUuid;

  protected ownerIdsExibidos(insight: RelatorioInsightItem): string[] {
    return (insight.owner_ids ?? []).filter((id) => id?.trim());
  }

  private carregar(forceNoCache = false): void {
    this.loading.set(true);
    this.error.set(null);

    const nocache = forceNoCache || shouldFetchInsightsNoCache();

    this.relatorio
      .fetchInsights({ nocache })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.data.set(res);
          this.error.set(null);
          if (res.gerado_em) {
            persistInsightsGeradoEmDia(res.gerado_em);
          }
        },
        error: () => {
          this.data.set(null);
          this.error.set(
            'Não foi possível carregar os insights. Verifique o endpoint `/api/relatorio/insights` ou a conexão.',
          );
        },
      });
  }
}
