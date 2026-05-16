import { RiskLevel } from '../data/mock-data';

/** Nivel de risco devolvido pela API de relatorio (`/api/relatorio/clientes`). */
export function nivelRiscoToRiskLevel(nivel: string | null | undefined): RiskLevel {
  if (nivel == null || nivel === '') {
    return 'saudavel';
  }
  const u = nivel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
  if (u === 'ALTO') return 'risco';
  if (u === 'MEDIO') return 'atencao';
  return 'saudavel';
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

export function riskLabel(risk: RiskLevel) {
  const labels: Record<RiskLevel, string> = {
    saudavel: 'Saudável',
    atencao: 'Atenção',
    risco: 'Risco alto',
  };
  return labels[risk];
}

export function riskClasses(risk: RiskLevel) {
  const classes: Record<RiskLevel, string> = {
    saudavel: 'bg-success/15 text-success border-success/30',
    atencao: 'bg-warning/15 text-warning border-warning/30',
    risco: 'bg-destructive/15 text-destructive border-destructive/30',
  };
  return classes[risk];
}

/**
 * Cor de preenchimento para barra de saude 0-100 (0 = pior, 100 = melhor).
 * Transicao continua vermelho -> amarelo -> verde usando tokens do tema.
 */
export function healthScoreBarBackground(health: number): string {
  const s = Math.max(0, Math.min(100, health));
  if (s <= 50) {
    const t = s / 50;
    return `color-mix(in oklch, var(--destructive) ${(1 - t) * 100}%, var(--warning) ${t * 100}%)`;
  }
  const t = (s - 50) / 50;
  return `color-mix(in oklch, var(--warning) ${(1 - t) * 100}%, var(--success) ${t * 100}%)`;
}

/** Cor do valor numerico ao lado da barra (mesma logica da barra). */
export function healthScoreTextColor(health: number): string {
  return healthScoreBarBackground(health);
}

/**
 * Classes Tailwind para legenda do risco IA bruto (maior nota = mais risco).
 * Complementa a barra de saude (100 - score_ia em muitos casos).
 */
export function iaRiskCaptionClass(scoreIa: number): string {
  const s = Math.max(0, Math.min(100, Number.isFinite(scoreIa) ? scoreIa : 0));
  if (s >= 66) {
    return 'font-semibold text-destructive';
  }
  if (s >= 33) {
    return 'font-semibold text-warning-foreground';
  }
  return 'font-semibold text-success';
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}

/** Perfil de uso da API (`EM_DECLINIO`, etc.) → rótulo legível (sem underscores). */
export function formatPerfilUso(perfil: string | undefined | null): string {
  if (!perfil?.trim()) {
    return '—';
  }
  const labels: Record<string, string> = {
    EM_DECLINIO: 'Em Declínio',
    ESTAVEL: 'Estável',
    EM_CRESCIMENTO: 'Em Crescimento',
    INATIVO: 'Inativo',
    ADOCAO_INICIAL: 'Adoção Inicial',
  };
  const key = perfil.trim().toUpperCase();
  if (labels[key]) {
    return labels[key];
  }
  return perfil
    .trim()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
