/** Chaves como retornadas pela API de atendimento (inglês) → rótulo em português para UI. */
const STATUS_API_PARA_PT: Record<string, string> = {
  closed: 'Fechado',
  new: 'Novo',
  stopped: 'Parado',
  inattendance: 'Em atendimento',
  canceled: 'Cancelado',
  cancelled: 'Cancelado',
  resolved: 'Resolvido',
  reopened: 'Reaberto',
  scheduled: 'Agendado',
  waitingevaluation: 'Aguardando avaliação',
  waitingcustomer: 'Aguardando cliente',
  waitingthirdparty: 'Aguardando terceiros',
};

function chaveNormalizada(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, '');
}

/** Traduz status de atendimento (API em inglês) para português; mantém o texto original se não houver de-para. */
export function atendimentoStatusLabelPt(statusApi: string): string {
  const key = chaveNormalizada(statusApi);
  return STATUS_API_PARA_PT[key] ?? statusApi;
}
