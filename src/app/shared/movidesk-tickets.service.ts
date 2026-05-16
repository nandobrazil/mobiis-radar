import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { normalizarResumoMovidesk } from '../data/movidesk-resumo.helpers';
import type { MovideskResumo } from '../data/movidesk-resumo.types';
import type { MovideskClienteIndicadores } from '../data/movidesk-cliente-indicadores.types';
import type { MovideskTicket } from '../data/movidesk-ticket.types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovideskTicketsService {
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

  list(): Observable<MovideskTicket[]> {
    return this.http.get<MovideskTicket[]>(this.ticketsUrl());
  }

  /** Indicadores agregados; chaves `null` nas distribuições viram **Não definido**. */
  resumo(): Observable<MovideskResumo> {
    return this.http.get<MovideskResumo>(this.resumoUrl()).pipe(map((raw) => normalizarResumoMovidesk(raw)));
  }

  clienteIndicadores(ownerId: string): Observable<MovideskClienteIndicadores> {
    return this.http.get<MovideskClienteIndicadores>(this.clienteIndicadoresUrl(ownerId));
  }
}
