/**
 * Empresas fixas no mesmo segmento (CNAE) para o mapa comercial.
 * Depois: substituir por GET que filtre pelo `cnae_fiscal` retornado pela busca.
 */
export interface ComercialSegmentPeer {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnaeFiscal: number;
  municipio: string;
  uf: string;
  lat: number;
  lng: number;
}

export const COMERCIAL_SEGMENT_PEERS_MOCK: ComercialSegmentPeer[] = [
  {
    cnpj: '45286135000129',
    razaoSocial: 'CIA HERING',
    nomeFantasia: 'HERING',
    cnaeFiscal: 4781400,
    municipio: 'Blumenau',
    uf: 'SC',
    lat: -26.9194,
    lng: -49.0661,
  },
  {
    cnpj: '61190310000123',
    razaoSocial: 'RENASC SKAI IND E COM DE VEST LTDA',
    cnaeFiscal: 4781400,
    municipio: 'Extrema',
    uf: 'MG',
    lat: -22.8547,
    lng: -46.3253,
  },
  {
    cnpj: '47960950000130',
    razaoSocial: 'GUARARAPES CONFECCOES SA',
    nomeFantasia: 'RI HAPPY',
    cnaeFiscal: 4781400,
    municipio: 'Fortaleza',
    uf: 'CE',
    lat: -3.7319,
    lng: -38.5267,
  },
  {
    cnpj: '02487547000129',
    razaoSocial: 'RESERVA COMERCIO DE ROUPAS LTDA',
    nomeFantasia: 'RESERVA',
    cnaeFiscal: 4781400,
    municipio: 'São Paulo',
    uf: 'SP',
    lat: -23.5489,
    lng: -46.6388,
  },
  {
    cnpj: '45854215000164',
    razaoSocial: 'AC FARIA COMERCIO DE ROUPAS E CALCADOS LTDA',
    cnaeFiscal: 4781400,
    municipio: 'Curitiba',
    uf: 'PR',
    lat: -25.4284,
    lng: -49.2733,
  },
  /** Mesmo arquivo: CNAE diferente para não aparecer ao buscar varejo de vestuário (4781400). */
  {
    cnpj: '00000000000191',
    razaoSocial: 'BANCO DO BRASIL SA',
    cnaeFiscal: 6422100,
    municipio: 'Brasília',
    uf: 'DF',
    lat: -15.7939,
    lng: -47.8828,
  },
];
