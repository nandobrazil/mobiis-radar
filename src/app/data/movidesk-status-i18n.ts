/** Chaves como retornadas pela API Movidesk (inglês) → rótulo em português para UI. */
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

/** Traduz status Movidesk (API em inglês) para português; mantém o texto original se não houver de-para. */
export function movideskStatusLabelPt(statusApi: string): string {
  const key = chaveNormalizada(statusApi);
  return STATUS_API_PARA_PT[key] ?? statusApi;
}
