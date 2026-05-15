import { RiskLevel } from '../data/mock-data';

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

export function riskLabel(risk: RiskLevel) {
  const labels: Record<RiskLevel, string> = {
    saudavel: 'Saudavel',
    atencao: 'Atencao',
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

export function scoreTone(score: number) {
  return score >= 70 ? 'bg-success' : score >= 45 ? 'bg-warning' : 'bg-destructive';
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}
