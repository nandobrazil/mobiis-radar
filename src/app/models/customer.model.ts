import { ProductKey } from './product.model';

export type RiskLevel = 'baixo' | 'medio' | 'alto';

export interface Customer {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  cnpj: string;
  email: string;
  phone: string;
  segment: string;
  plan: string;
  loadsMonth: number;
  activeLanes: number;
  engagement: number;
  risk: RiskLevel;
  coordinates: {
    lng: number;
    lat: number;
  };
  products: ProductKey[];
  lastLoginDays: number;
  contact: string;
  recommendedAction: string;
}

export type ProductFilter = 'todos' | ProductKey;
export type RiskFilter = 'todos' | RiskLevel;
