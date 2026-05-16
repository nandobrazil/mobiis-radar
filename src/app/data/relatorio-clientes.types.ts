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
  segmento?: string;
  lat?: number;
  lng?: number;
}

export interface RelatorioAnalise {
  nivel_risco: string;
  score_ia: number;
  resumo: string;
  motivos: string[];
  acao_recomendada: string;
  perfil_uso?: string;
  padrao_historico?: string;
}

export interface RelatorioOwnerCnaeSecundario {
  codigo: number;
  descricao: string;
}

/** Dados cadastrais / geográficos (GET `/api/relatorio/clientes`). */
export interface RelatorioOwner {
  id: string;
  nome: string;
  tipo?: number;
  status?: number;
  documento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string | null;
  bairro?: string;
  municipio?: string;
  uf?: string;
  lat?: number | null;
  lng?: number | null;
  razao_social?: string;
  nome_fantasia?: string;
  cnae_fiscal?: number;
  cnae_fiscal_descricao?: string;
  cnaes_secundarios?: RelatorioOwnerCnaeSecundario[];
  porte?: string;
  natureza_juridica?: string;
  capital_social?: number;
  data_inicio_atividade?: string;
  opcao_pelo_simples?: boolean | null;
}

/** Contexto CS na raiz do GET `/api/relatorio/cliente/{owner_id}` (e lista quando presente). */
export interface RelatorioClienteContexto {
  owner_id?: string;
  contexto: string;
  autor?: string;
  atualizado_em?: string;
}

/** Linha do relatorio (GET `/api/relatorio/clientes` ou GET `/api/relatorio/cliente/{owner_id}`). */
export interface RelatorioClienteItem {
  cliente: RelatorioCliente;
  /** A API pode omitir ou enviar `null` em registos incompletos. */
  analise?: RelatorioAnalise | null;
  /** Quando true, a analise IA falhou mas `cliente` costuma vir preenchido. */
  erro?: boolean;
  /** Notas do CS; vem na raiz do GET do cliente (sem GET `/contexto` separado). */
  contexto?: RelatorioClienteContexto | null;
  /** Cadastro CNPJ / CNAE / coordenadas para mapa comercial. */
  owner?: RelatorioOwner | null;
}

export interface RelatorioClientePorEntidade {
  entidade_id: number;
  entidade: string;
  acoes_30d: number;
  acoes_90d: number;
  negativas_30d: number;
  negativas_90d: number;
  automatizadas_30d: number;
  usuarios_distintos_30d: number;
  ultima_acao: string | null;
}

export interface RelatorioClientePorOrigem {
  origem_id: number;
  origem: string;
  acoes_30d: number;
  acoes_90d: number;
}

/** Resposta GET /api/relatorio/cliente/{owner_id}/detalhe */
export interface RelatorioClienteDetalle {
  owner_id: string;
  nome_cliente: string;
  por_entidade: RelatorioClientePorEntidade[];
  por_origem: RelatorioClientePorOrigem[];
  tendencia_semanal: Record<string, unknown>[];
}
