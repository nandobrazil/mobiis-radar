import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import type { MovideskTicket } from '../data/movidesk-ticket.types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovideskTicketsService {
  private readonly http = inject(HttpClient);

  private ticketsUrl(): string {
    const root = environment.apiBaseUrl.replace(/\/$/, '');
    return `${root}/api/movidesk/tickets`;
  }

  list(): Observable<MovideskTicket[]> {
    return this.http.get<MovideskTicket[]>(this.ticketsUrl());
  }
}
