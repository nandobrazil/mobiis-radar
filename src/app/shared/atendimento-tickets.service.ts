import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { normalizarResumoAtendimento } from '../data/atendimento-resumo.helpers';
import type { AtendimentoResumo } from '../data/atendimento-resumo.types';
import type { AtendimentoClienteIndicadores } from '../data/atendimento-cliente-indicadores.types';
import type { AtendimentoTicket } from '../data/atendimento-ticket.types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AtendimentoTicketsService {
  private readonly http = inject(HttpClient);

  private apiRoot(): string {
    return environment.apiBaseUrl.replace(/\/$/, '');
  }

  private ticketsUrl(): string {
    return `${this.apiRoot()}/api/movidesk/tickets`;
  }

  private resumoUrl(): string {
    return `${this.apiRoot()}/api/movidesk/resumo`;
  }

  /** GET /api/movidesk/indicadores/{owner_id} — indicadores por cliente. */
  clienteIndicadoresUrl(ownerId: string): string {
    return `${this.apiRoot()}/api/movidesk/indicadores/${encodeURIComponent(ownerId.trim())}`;
  }

  list(): Observable<AtendimentoTicket[]> {
    return this.http.get<AtendimentoTicket[]>(this.ticketsUrl());
  }

  /** Indicadores agregados; chaves `null` nas distribuições viram **Não definido**. */
  resumo(): Observable<AtendimentoResumo> {
    return this.http.get<AtendimentoResumo>(this.resumoUrl()).pipe(map((raw) => normalizarResumoAtendimento(raw)));
  }

  clienteIndicadores(ownerId: string): Observable<AtendimentoClienteIndicadores> {
    return this.http.get<AtendimentoClienteIndicadores>(this.clienteIndicadoresUrl(ownerId));
  }
}
