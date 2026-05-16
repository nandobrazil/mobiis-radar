/** Resposta de GET /api/movidesk/indicadores/{owner_id}. */
export interface AtendimentoClienteIndicadores {
  owner_id: string;
  nome_cliente: string;
  emails_vinculados: string[];
  total_tickets: number;
  tickets_90d: number;
  tickets_30d: number;
  tickets_abertos: number;
  tickets_pendentes: number;
  tickets_encerrados: number;
  tickets_alta_urgencia: number;
  tempo_medio_resolucao_horas: number | null;
  tendencia: string;
  tendencia_delta_pct: number;
  por_categoria: Record<string, number>;
  score_suporte: number;
}
