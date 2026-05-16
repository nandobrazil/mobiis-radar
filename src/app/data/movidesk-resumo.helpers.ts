import type { MovideskResumo } from './movidesk-resumo.types';

/** Chaves que representam categoria/urgência/status sem valor no Movidesk. */
function isChaveSemValor(rawKey: string): boolean {
  const key = rawKey?.trim() ?? '';
  if (!key) {
    return true;
  }
  const lower = key.toLowerCase();
  return lower === 'null' || lower === 'undefined';
}

/**
 * Soma contagens cuja chave é "null" (ou vazia) em **Outros**.
 * Se já existir a chave "Outros", acumula nela.
 */
export function agruparChavesNulasComoOutros(dist: Record<string, number>): Record<string, number> {
  const next: Record<string, number> = {};
  let outros = 0;
  for (const [rawKey, count] of Object.entries(dist ?? {})) {
    if (isChaveSemValor(rawKey)) {
      outros += count;
      continue;
    }
    next[rawKey] = (next[rawKey] ?? 0) + count;
  }
  if (outros > 0) {
    next['Outros'] = (next['Outros'] ?? 0) + outros;
  }
  return next;
}

/** Aplica agrupamento de nulos nas distribuições categóricas do resumo. */
export function normalizarResumoMovidesk(raw: MovideskResumo): MovideskResumo {
  return {
    ...raw,
    por_status: agruparChavesNulasComoOutros(raw.por_status ?? {}),
    por_categoria: agruparChavesNulasComoOutros(raw.por_categoria ?? {}),
    por_urgencia: agruparChavesNulasComoOutros(raw.por_urgencia ?? {}),
  };
}
