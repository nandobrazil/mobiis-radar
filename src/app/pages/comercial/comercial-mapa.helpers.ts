import type { RiskLevel } from '../../data/mock-data';
import type { RelatorioClienteItem } from '../../data/relatorio-clientes.types';
import { coordsFromUf } from '../../data/brasil-uf-centers';
import type { GeoMapMarker } from '../../shared/geo-map/geo-map-marker.model';
import { nivelRiscoToRiskLevel } from '../../shared/ui-helpers';

export const COMERCIAL_MAP_RISK_COLOR: Record<RiskLevel, string> = {
  saudavel: '#4ade80',
  atencao: '#facc15',
  risco: '#f87171',
};

export function normalizeCnaeDescricao(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function relatorioRowToGeoMarker(row: RelatorioClienteItem): GeoMapMarker | null {
  const owner = row.owner;
  const cliente = row.cliente;
  if (!cliente) {
    return null;
  }

  let lat = owner?.lat ?? cliente.lat;
  let lng = owner?.lng ?? cliente.lng;

  if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
    const uf = owner?.uf?.trim();
    if (!uf) {
      return null;
    }
    [lat, lng] = coordsFromUf(uf);
  }

  const risk = nivelRiscoToRiskLevel(row.analise?.nivel_risco);
  const nome =
    owner?.nome_fantasia?.trim() ||
    owner?.razao_social?.trim() ||
    owner?.nome?.trim() ||
    cliente.nome_cliente;
  const local = [owner?.municipio, owner?.uf].filter(Boolean).join('/');
  const label = local ? `${nome} · ${local}` : nome;

  return {
    lat: Number(lat),
    lng: Number(lng),
    label,
    color: COMERCIAL_MAP_RISK_COLOR[risk],
    radius: 8,
  };
}

export function filterRelatorioPorCnaeDescricao(
  rows: RelatorioClienteItem[],
  cnaeDescricao: string | null,
): RelatorioClienteItem[] {
  if (!cnaeDescricao?.trim()) {
    return rows;
  }
  const alvo = normalizeCnaeDescricao(cnaeDescricao);
  return rows.filter((row) => {
    const desc = row.owner?.cnae_fiscal_descricao;
    return desc != null && normalizeCnaeDescricao(desc) === alvo;
  });
}
