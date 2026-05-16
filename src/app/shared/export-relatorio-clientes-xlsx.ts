import * as XLSX from 'xlsx';

import type { RelatorioClienteItem } from '../data/relatorio-clientes.types';

/** Gera e baixa um arquivo Excel (.xlsx) no navegador a partir das linhas do relatorio. */
export function exportRelatorioClientesToXlsx(rows: RelatorioClienteItem[], baseName = 'relatorio-clientes'): void {
  const data = rows
    .filter((r) => r?.cliente != null)
    .map((r) => {
      const c = r.cliente;
      return {
        'Nome cliente': c.nome_cliente,
        'Owner ID': c.owner_id,
        'Dias sem uso': c.dias_sem_atividade,
        'Ações 30d': c.acoes_30d,
        'Ações 90d': c.acoes_90d,
        'Ações core 30d': c.acoes_core_30d,
        'Ações core 90d': c.acoes_core_90d,
        'Ações negativas 30d': c.acoes_negativas_30d,
        'Entidades utilizadas': c.entidades_utilizadas,
        'Usuários ativos': c.usuarios_ativos,
        'Ações automatizadas 30d': c.acoes_automatizadas_30d,
        'Score IA': r.analise?.score_ia ?? '',
        'Nível risco (IA)': r.analise?.nivel_risco ?? '',
        'Resumo (IA)': r.analise?.resumo ?? '',
        'Sem análise IA': r.analise ? 'Não' : 'Sim',
        'Erro análise': r.erro ? 'Sim' : 'Não',
      };
    });

  if (data.length === 0) {
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes', true);

  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, '')
    .replace('T', '-');
  XLSX.writeFile(wb, `${baseName}-${stamp}.xlsx`);
}
