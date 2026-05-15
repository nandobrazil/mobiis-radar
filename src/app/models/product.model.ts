export interface Product {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  ownership: 'Embarcador' | 'Transportadora';
}

export type ProductKey =
  | 'Roteirizador'
  | 'TMS'
  | 'DMS'
  | 'YMS'
  | 'MarketplaceFretes';
