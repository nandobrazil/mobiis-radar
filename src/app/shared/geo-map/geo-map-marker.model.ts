/** Marcador exibido no mapa — cores e raio são definidos pelo consumidor. */
export interface GeoMapMarker {
  lat: number;
  lng: number;
  /** Conteúdo padrão (popup e tooltip quando os campos específicos não forem informados). */
  label: string;
  /** Tooltip no hover; se omitido, usa `label`. */
  tooltip?: string;
  /** Título do popup no clique; se omitido, usa `label`. */
  popupTitle?: string;
  /** Cor de preenchimento (hex ou valor CSS). */
  color?: string;
  /** Raio do círculo em px. Padrão: 8. */
  radius?: number;
  /** `owner_id` para link ao detalhe (`#/cliente/{id}`). */
  ownerId?: string;
}

/** Item da legenda opcional no canto do mapa. */
export interface GeoMapLegendItem {
  label: string;
  /** Cor do indicador (hex ou valor CSS para `background-color`). */
  color: string;
}

export const GEO_MAP_DEFAULT_MARKER_COLOR = '#6366f1';
export const GEO_MAP_DEFAULT_RADIUS = 8;
