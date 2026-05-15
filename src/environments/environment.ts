/**
 * Ambiente de desenvolvimento (ng serve, build --configuration=development).
 * Ajuste `apiBaseUrl` conforme o backend local ou homologacao.
 */
export const environment = {
  production: false,
  /** Origem da API (sem barra final): http permitido em dev. */
  apiBaseUrl: 'http://147.93.33.129:8999',
};
