/**
 * Producao: substitui `environment.ts` via fileReplacements no angular.json.
 * Em producao a API deve usar HTTPS (proxy/TLS na borda ou certificado no host).
 */
export const environment = {
  production: true,
  /**
   * Defina a URL publica HTTPS da API (ex.: https://api.seudominio.com).
   * Substitua pelo endpoint real antes do deploy de producao.
   */
  apiBaseUrl: 'https://mobiis-radar-api.oconde.dev',
};
