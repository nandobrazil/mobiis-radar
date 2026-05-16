/** Centro aproximado por UF (mapa comercial quando a API não retorna lat/lng). */
export const BRASIL_UF_CENTER: Record<string, [number, number]> = {
  AC: [-9.9754, -67.8243],
  AL: [-9.6658, -35.735],
  AM: [-3.119, -60.0217],
  AP: [0.0349, -51.0694],
  BA: [-12.97, -38.5],
  CE: [-3.7172, -38.5433],
  DF: [-15.7939, -47.8828],
  ES: [-19.1834, -40.3089],
  GO: [-16.68, -49.25],
  MA: [-2.5387, -44.2825],
  MT: [-12.6819, -56.9211],
  MS: [-20.4428, -54.6464],
  MG: [-19.92, -43.94],
  PA: [-1.4554, -48.4898],
  PB: [-7.1219, -34.882],
  PR: [-25.4284, -49.2733],
  PE: [-8.05, -34.9],
  PI: [-5.0919, -42.8034],
  RJ: [-22.91, -43.17],
  RN: [-5.4026, -36.9541],
  RS: [-30.03, -51.23],
  RO: [-8.7619, -63.9039],
  RR: [2.8235, -60.6758],
  SC: [-27.2423, -50.2189],
  SP: [-23.55, -46.63],
  SE: [-10.5741, -37.3857],
  TO: [-10.25, -48.3243],
};

export function coordsFromUf(uf: string): [number, number] {
  const key = uf.trim().toUpperCase();
  return BRASIL_UF_CENTER[key] ?? [-14.2, -51.9];
}
