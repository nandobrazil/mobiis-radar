import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

/**
 * Tabela de dados com estilo unificado (thead/tbody).
 * Projeta uma linha de cabeçalho com `data-table-head-row` e as demais linhas no corpo.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  /** Classes extras na `<table>` (ex.: `min-w-[1040px]`). */
  tableClass = input<string>('');
}
