export type RelatorioInsightTipo = 'RISCO' | 'PADRAO' | 'OPORTUNIDADE';

export interface RelatorioInsightItem {
  tipo: RelatorioInsightTipo;
  titulo: string;
  descricao: string;
  clientes_afetados: number;
  owner_ids: string[];
  acao_sugerida: string;
}

export interface RelatorioAcaoPriorizada {
  owner_id: string;
  nome: string;
  probabilidade_churn_60d: number;
  nivel_risco: string;
  score_ia: number;
  acao_recomendada: string;
}

/** Resposta GET `/api/relatorio/insights`. */
export interface RelatorioInsightsResponse {
  gerado_em: string;
  de_cache: boolean;
  total_clientes_analisados: number;
  insights: RelatorioInsightItem[];
  acoes_priorizadas: RelatorioAcaoPriorizada[];
}
