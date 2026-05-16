import * as L from 'leaflet';

type MarkerClusterGroupInstance = L.MarkerClusterGroup;
type MarkerClusterGroupFactory = (options?: L.MarkerClusterGroupOptions) => MarkerClusterGroupInstance;

type MarkerClusterModule = {
  MarkerClusterGroup?: new (options?: L.MarkerClusterGroupOptions) => MarkerClusterGroupInstance;
};

let initPromise: Promise<void> | null = null;
let clusterFactory: MarkerClusterGroupFactory | null = null;

function resolveMarkerClusterCtor(mod: unknown): MarkerClusterModule['MarkerClusterGroup'] {
  const m = mod as MarkerClusterModule & { default?: MarkerClusterModule };
  return m.MarkerClusterGroup ?? m.default?.MarkerClusterGroup;
}

/**
 * Garante o plugin na mesma instância de Leaflet do app (evita `markerClusterGroup is not a function` em produção).
 */
export function initLeafletMarkerCluster(): Promise<void> {
  if (clusterFactory) {
    return Promise.resolve();
  }

  if (typeof L.markerClusterGroup === 'function') {
    clusterFactory = (options) => L.markerClusterGroup(options);
    return Promise.resolve();
  }

  if (!initPromise) {
    initPromise = (async () => {
      (globalThis as typeof globalThis & { L?: typeof L }).L = L;

      const mod = await import('leaflet.markercluster');
      const MarkerClusterGroupCtor = resolveMarkerClusterCtor(mod);

      if (typeof L.markerClusterGroup === 'function') {
        clusterFactory = (options) => L.markerClusterGroup(options);
        return;
      }

      if (MarkerClusterGroupCtor) {
        clusterFactory = (options) => new MarkerClusterGroupCtor(options);
        return;
      }

      throw new Error('leaflet.markercluster: markerClusterGroup indisponível após carregar o plugin.');
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  return initPromise;
}

export function isMarkerClusterAvailable(): boolean {
  return clusterFactory != null;
}

export function createMarkerClusterGroup(options?: L.MarkerClusterGroupOptions): MarkerClusterGroupInstance {
  if (!clusterFactory) {
    throw new Error('leaflet.markercluster não inicializado');
  }
  return clusterFactory(options);
}

export { L };
