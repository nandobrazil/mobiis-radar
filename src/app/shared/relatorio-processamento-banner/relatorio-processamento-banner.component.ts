import { Component, computed, inject } from '@angular/core';

import { RelatorioClientesService } from '../relatorio-clientes.service';

@Component({
  selector: 'app-relatorio-processamento-banner',
  standalone: true,
  template: `
    @if (relatorio.processandoAnalise()) {
      <div
        class="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium text-foreground">Análise da IA em andamento</p>
            <p class="mt-0.5 text-xs text-muted-foreground">
              A lista será atualizada automaticamente quando o processamento terminar.
            </p>
          </div>
          @if (progressoPct() > 0) {
            <p class="shrink-0 text-sm font-semibold tabular-nums text-primary">{{ progressoPct() }}%</p>
          }
        </div>
        @if (progressoPct() > 0) {
          <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-gradient-primary transition-[width] duration-500"
              [style.width.%]="progressoPct()"
            ></div>
          </div>
        }
        @if (detalhe(); as d) {
          <p class="mt-2 text-[11px] tabular-nums text-muted-foreground">{{ d }}</p>
        }
      </div>
    }
  `,
})
export class RelatorioProcessamentoBannerComponent {
  protected readonly relatorio = inject(RelatorioClientesService);

  protected readonly progressoPct = computed(() => this.relatorio.processamentoProgressoPct());

  protected readonly detalhe = computed(() => {
    const s = this.relatorio.processamentoStatus();
    if (!s) {
      return null;
    }
    const partes: string[] = [];
    if (s.clientes_total != null && s.clientes_analisados != null) {
      partes.push(`${s.clientes_analisados} de ${s.clientes_total} clientes analisados`);
    }
    if (s.chunks_total != null && s.chunks_concluidos != null) {
      partes.push(`${s.chunks_concluidos} de ${s.chunks_total} lotes concluídos`);
    }
    return partes.length > 0 ? partes.join(' · ') : null;
  });
}
