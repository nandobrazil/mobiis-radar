const STORAGE_KEY = 'mobiis.relatorio.insights.gerado_em_dia';

/** Chave de dia civil (YYYY-MM-DD) no fuso local. */
export function insightsCalendarDayKey(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function insightsHojeCalendarDayKey(): string {
  return insightsCalendarDayKey(new Date());
}

export function readInsightsGeradoEmDiaSalvo(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistInsightsGeradoEmDia(geradoEm: string): void {
  const key = insightsCalendarDayKey(geradoEm);
  if (!key) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    /* quota / modo privado */
  }
}

/** `true` quando o último insight salvo no browser é de outro dia civil. */
export function shouldFetchInsightsNoCache(): boolean {
  const salvo = readInsightsGeradoEmDiaSalvo();
  if (!salvo) {
    return false;
  }
  return salvo !== insightsHojeCalendarDayKey();
}
