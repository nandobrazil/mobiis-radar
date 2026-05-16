/** Resposta de GET /api/movidesk/resumo (chaves literais "null" indicam valor ausente no backend). */
export interface AtendimentoResumo {
  periodo_dias: number;
  total: number;
  por_status: Record<string, number>;
  por_categoria: Record<string, number>;
  por_urgencia: Record<string, number>;
  tempo_medio_resolucao_horas: number;
  abertos: number;
  em_andamento: number;
  encerrados: number;
}
