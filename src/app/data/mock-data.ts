export type RiskLevel = 'saudavel' | 'atencao' | 'risco';

export interface Customer {
  id: string;
  name: string;
  segment: string;
  products: string[];
  score: number;
  trend: number;
  risk: RiskLevel;
  lastUse: string;
  potential: 'alto' | 'medio' | 'baixo';
  region: string;
  seller: string;
  status: 'ativo' | 'pausado' | 'onboarding';
  lat: number;
  lng: number;
  mrr: number;
}

const SEGMENTS = ['Varejo', 'Indústria', 'Logística 3PL', 'E-commerce', 'Distribuição', 'FMCG', 'Farma'];
const PRODUCTS = ['Roteirização', 'Torre de Controle', 'Planner', 'ERP Connect', 'Mobile Driver', 'Analytics+'];
const REGIONS = ['SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'PE', 'DF', 'SC', 'GO'];
const SELLERS = ['Ana Lima', 'Bruno Sa', 'Carla Reis', 'Diego Costa', 'Eduarda M.', 'Felipe R.'];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const r = rng(42);

const NAMES = [
  'TransLog Brasil', 'MoveFast Cargo', 'RotaPlus', 'EntregaJa', 'VialNorte',
  'CargoSmart', 'PrimeRoute', 'EcoDelivery', 'GrandeBR', 'AtlasCargo',
  'VeloxLog', 'RioFreight', 'MercoSul Trans', 'Agil Express', 'SudesteLog',
  'Norte Distribuição', 'MaxCargo', 'PortoFretes', 'BR Movimenta', 'Cidade Express',
  'Centroeste Log', 'Hyper Distri', 'Solar Cargo', 'Plena Rotas', 'OneFleet',
  'ZeroAtraso', 'Ondalogistica', 'Camino BR', 'PronTrans', 'Nucleo Cargo',
];

const COORDS: Record<string, [number, number]> = {
  SP: [-23.55, -46.63],
  RJ: [-22.91, -43.17],
  MG: [-19.92, -43.94],
  PR: [-25.43, -49.27],
  RS: [-30.03, -51.23],
  BA: [-12.97, -38.5],
  PE: [-8.05, -34.9],
  DF: [-15.79, -47.88],
  SC: [-27.59, -48.55],
  GO: [-16.68, -49.25],
};

export const customers: Customer[] = NAMES.map((name, i) => {
  const region = REGIONS[Math.floor(r() * REGIONS.length)];
  const score = Math.round(20 + r() * 80);
  const risk: RiskLevel = score >= 70 ? 'saudavel' : score >= 45 ? 'atencao' : 'risco';
  const [lat, lng] = COORDS[region] ?? COORDS['SP'];
  const numProducts = 1 + Math.floor(r() * 4);
  const products = [...PRODUCTS].sort(() => r() - 0.5).slice(0, numProducts);

  return {
    id: `c-${i + 1}`,
    name,
    segment: SEGMENTS[Math.floor(r() * SEGMENTS.length)],
    products,
    score,
    trend: Math.round((r() - 0.4) * 60),
    risk,
    lastUse: new Date(Date.now() - Math.floor(r() * 30) * 86400000).toISOString(),
    potential: r() > 0.66 ? 'alto' : r() > 0.33 ? 'medio' : 'baixo',
    region,
    seller: SELLERS[Math.floor(r() * SELLERS.length)],
    status: r() > 0.85 ? 'onboarding' : r() > 0.1 ? 'ativo' : 'pausado',
    lat: lat + (r() - 0.5) * 1.5,
    lng: lng + (r() - 0.5) * 1.5,
    mrr: Math.round(3000 + r() * 47000),
  };
});

export const portfolioHealth = Array.from({ length: 12 }).map((_, i) => ({
  month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
  saude: Math.round(58 + Math.sin(i / 2) * 8 + i * 1.2),
  risco: Math.round(28 - Math.sin(i / 2) * 6 - i * 0.6),
  atencao: Math.round(20 + Math.cos(i / 3) * 5),
}));

export const usageSeries = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  rotas: Math.round(120 + Math.sin(i) * 30 + i * 6),
  torre: Math.round(80 + Math.cos(i) * 20 + i * 4),
  planner: Math.round(60 + Math.sin(i / 2) * 15 + i * 3),
}));

export const segmentRanking = SEGMENTS.map((segment) => {
  const list = customers.filter((customer) => customer.segment === segment);
  const score = list.length ? Math.round(list.reduce((sum, customer) => sum + customer.score, 0) / list.length) : 0;
  return { segment, score, clientes: list.length };
}).sort((a, b) => b.score - a.score);

export const productAdoption = PRODUCTS.map((product, i) => ({
  product,
  adocao: Math.round(40 + ((i * 17 + 23) % 55)),
}));

export const funil = [
  { stage: 'Prospecção', value: 120 },
  { stage: 'Qualificação', value: 84 },
  { stage: 'Proposta', value: 52 },
  { stage: 'Negociação', value: 28 },
  { stage: 'Fechamento', value: 14 },
];

export const integrations = [
  { name: 'PostgreSQL', type: 'Database', status: 'conectado', last: 'agora' },
  { name: 'SQL Server', type: 'Database', status: 'sincronizando', last: 'há 1 min' },
  { name: 'API Roteirização', type: 'REST API', status: 'conectado', last: 'há 2 min' },
  { name: 'ERP TOTVS', type: 'ERP', status: 'atualizado', last: 'há 12 min' },
  { name: 'ERP SAP', type: 'ERP', status: 'erro', last: 'há 3 h' },
  { name: 'CSV Diário', type: 'Arquivo', status: 'atualizado', last: 'há 1 h' },
  { name: 'Webhook Eventos', type: 'Webhook', status: 'conectado', last: 'agora' },
  { name: 'API Torre de Controle', type: 'REST API', status: 'conectado', last: 'há 5 min' },
];

export function kpis() {
  const total = customers.length;
  const risco = customers.filter((customer) => customer.risk === 'risco').length;
  const saudaveis = customers.filter((customer) => customer.risk === 'saudavel').length;
  const atencao = customers.filter((customer) => customer.risk === 'atencao').length;
  const oportunidades = customers.filter((customer) => customer.potential === 'alto').length;
  const scoreMedio = Math.round(customers.reduce((sum, customer) => sum + customer.score, 0) / total);
  const mrr = customers.reduce((sum, customer) => sum + customer.mrr, 0);
  return { total, risco, saudaveis, atencao, oportunidades, scoreMedio, mrr };
}

export const allProducts = PRODUCTS;
