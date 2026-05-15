export type LatLng = [number, number];

export interface LeafletIcon {
  options?: unknown;
}

export interface LeafletMarker {
  addTo(map: LeafletMap): LeafletMarker;
  bindTooltip(text: string, options: { direction: 'top'; offset: LatLng; opacity: number }): LeafletMarker;
  on(eventName: 'click', callback: () => void): LeafletMarker;
  remove(): void;
}

export interface LeafletMap {
  remove(): void;
  removeLayer(layer: LeafletTileLayer): LeafletMap;
  setView(center: LatLng, zoom: number, options?: { animate?: boolean }): LeafletMap;
}

export interface LeafletTileLayer {
  addTo(map: LeafletMap): LeafletTileLayer;
}

export interface LeafletGlobal {
  divIcon(options: {
    className: string;
    html: string;
    iconAnchor: LatLng;
    iconSize: LatLng;
    popupAnchor: LatLng;
  }): LeafletIcon;
  map(container: HTMLElement, options: { scrollWheelZoom: boolean }): LeafletMap;
  marker(coordinates: LatLng, options: { icon: LeafletIcon; keyboard: boolean; title: string }): LeafletMarker;
  tileLayer(url: string, options: { attribution: string; maxZoom: number }): LeafletTileLayer;
}

declare global {
  var L: LeafletGlobal | undefined;
}
