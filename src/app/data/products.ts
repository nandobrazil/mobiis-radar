import { Product, ProductKey } from '../models/product.model';

export const PRODUCTS: Record<ProductKey, Product> = {
  Roteirizador: {
    id: '4A2BE043-0E82-4C2E-8CD0-E95C381FA7A3',
    label: 'Roteirizador',
    shortLabel: 'R',
    description: 'Roteirizacao simplificada',
    ownership: 'Embarcador',
  },
  TMS: {
    id: '39563B6D-B0E2-4423-892E-FA5EDEB70C52',
    label: 'TMS',
    shortLabel: 'TMS',
    description: 'Gestao de transporte',
    ownership: 'Embarcador',
  },
  DMS: {
    id: '74B659BF-46D8-43E2-B86F-76C90EEC55B7',
    label: 'DMS',
    shortLabel: 'DMS',
    description: 'Gestao de entregas',
    ownership: 'Transportadora',
  },
  YMS: {
    id: '85DC6979-C945-4330-A1EF-6C9D6AD1ED1A',
    label: 'YMS',
    shortLabel: 'YMS',
    description: 'Gestao do patio, carga e descarga',
    ownership: 'Embarcador',
  },
  MarketplaceFretes: {
    id: 'DA2DF86C-2D7E-4A58-928D-DCA4576C9E86',
    label: 'Marketplace de Fretes',
    shortLabel: 'MKT',
    description: 'Contratacao e oferta de fretes',
    ownership: 'Transportadora',
  },
};

export const PRODUCT_KEYS = Object.keys(PRODUCTS) as ProductKey[];
