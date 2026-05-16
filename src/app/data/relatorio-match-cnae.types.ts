import type { RelatorioAnalise, RelatorioOwnerCnaeSecundario } from './relatorio-clientes.types';

/** Corpo aceito por POST `/api/relatorio/match-cnae` (payload mínimo ou completo da BrasilAPI). */
export type RelatorioMatchCnaeRequest = Record<string, unknown> & {
  cnae_fiscal: number;
  cnae_fiscal_descricao?: string;
  cnaes_secundarios?: RelatorioOwnerCnaeSecundario[];
};

export type RelatorioMatchCnaeSimilaridade = 'EXATO' | 'DIVISAO';

export interface RelatorioMatchCnaeItem {
  owner_id: string;
  nome: string;
  documento?: string;
  municipio?: string;
  uf?: string;
  lat?: number | null;
  lng?: number | null;
  modulos?: string[];
  cnae_fiscal?: number;
  cnae_fiscal_descricao?: string;
  similaridade: RelatorioMatchCnaeSimilaridade;
  cnaes_em_comum?: RelatorioOwnerCnaeSecundario[];
  analise?: RelatorioAnalise | null;
}

export interface RelatorioMatchCnaeModuloUso {
  modulo: string;
  count: number;
  percentual: number;
}

export interface RelatorioMatchCnaeUfCount {
  uf: string;
  count: number;
}

export interface RelatorioMatchCnaeInsights {
  total_clientes_similares: number;
  modulos_mais_usados?: RelatorioMatchCnaeModuloUso[];
  uf_com_mais_clientes?: RelatorioMatchCnaeUfCount[];
  argumento_venda: string;
  diferenciais: string[];
  modulos_recomendados?: string[];
  abordagem_sugerida?: string;
  oportunidades: string[];
  riscos_conhecidos: string[];
}

export interface RelatorioMatchCnaeResponse {
  matches: RelatorioMatchCnaeItem[];
  insights: RelatorioMatchCnaeInsights;
}
