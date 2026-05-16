/** Texto exibido nos gráficos quando a chave ou o rótulo equivalem a ausência de valor. */
export const MOVIDESK_GRAFICO_NAO_DEFINIDO = 'Não definido';

/**
 * Normaliza rótulo para o gráfico: chaves literais `null`/`undefined` ou vazias viram **Não definido**.
 */
export function movideskRotuloGrafico(rotulo: string): string {
  const t = rotulo.trim().toLowerCase();
  if (!t || t === 'null' || t === 'undefined') {
    return MOVIDESK_GRAFICO_NAO_DEFINIDO;
  }
  return rotulo;
}
