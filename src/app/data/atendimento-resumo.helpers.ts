import type { AtendimentoResumo } from './atendimento-resumo.types';
import { ATENDIMENTO_GRAFICO_NAO_DEFINIDO } from './atendimento-grafico-labels';

/** Chaves que representam categoria/urgência/status sem valor no atendimento. */
function isChaveSemValor(rawKey: string): boolean {
  const key = rawKey?.trim() ?? '';
  if (!key) {
    return true;
  }
  const lower = key.toLowerCase();
  return lower === 'null' || lower === 'undefined';
}

/**
 * Soma contagens cuja chave é "null" (ou vazia) em **Não definido**.
 * Se já existir essa chave, acumula nela.
 */
export function agruparChavesNulasComoOutros(dist: Record<string, number>): Record<string, number> {
  const next: Record<string, number> = {};
  let indefinidos = 0;
  for (const [rawKey, count] of Object.entries(dist ?? {})) {
    if (isChaveSemValor(rawKey)) {
      indefinidos += count;
      continue;
    }
    next[rawKey] = (next[rawKey] ?? 0) + count;
  }
  if (indefinidos > 0) {
    next[ATENDIMENTO_GRAFICO_NAO_DEFINIDO] = (next[ATENDIMENTO_GRAFICO_NAO_DEFINIDO] ?? 0) + indefinidos;
  }
  return next;
}

/** Aplica agrupamento de nulos nas distribuições categóricas do resumo. */
export function normalizarResumoAtendimento(raw: AtendimentoResumo): AtendimentoResumo {
  return {
    ...raw,
    por_status: agruparChavesNulasComoOutros(raw.por_status ?? {}),
    por_categoria: agruparChavesNulasComoOutros(raw.por_categoria ?? {}),
    por_urgencia: agruparChavesNulasComoOutros(raw.por_urgencia ?? {}),
  };
}
