/** Resposta parcial do GET https://brasilapi.com.br/api/cnpj/v1/{cnpj} */
export interface BrasilApiCnpjQsaItem {
  nome_socio: string;
  qualificacao_socio: string;
  data_entrada_sociedade?: string;
}

export interface BrasilApiCnpjCnaeSecundario {
  codigo: number;
  descricao: string;
}

export interface BrasilApiCnpj {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral?: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios?: BrasilApiCnpjCnaeSecundario[];
  uf: string;
  municipio: string;
  logradouro: string;
  descricao_tipo_de_logradouro?: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  capital_social: number;
  natureza_juridica: string;
  porte: string;
  identificador_matriz_filial?: number;
  descricao_identificador_matriz_filial?: string;
  data_inicio_atividade: string;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  email?: string | null;
  qsa?: BrasilApiCnpjQsaItem[];
}
