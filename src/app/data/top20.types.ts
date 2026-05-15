export interface RelatorioCliente {
  owner_id: string;
  nome_cliente: string;
  dias_sem_atividade: number;
  acoes_90d: number;
  acoes_30d: number;
  acoes_core_30d: number;
  acoes_core_90d: number;
  acoes_negativas_30d: number;
  entidades_utilizadas: number;
  usuarios_ativos: number;
  acoes_automatizadas_30d: number;
}

export interface RelatorioAnalise {
  nivel_risco: string;
  score_ia: number;
  resumo: string;
  motivos: string[];
  acao_recomendada: string;
}

export interface RelatorioTop20Item {
  cliente: RelatorioCliente;
  analise: RelatorioAnalise;
}
