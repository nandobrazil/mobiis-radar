import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface ClienteContextoDto {
  owner_id: string;
  contexto: string;
  autor: string;
  atualizado_em: string;
}

export interface ClienteContextoSavePayload {
  contexto: string;
  autor: string;
}

function contextoUrl(ownerId: string): string {
  const root = environment.apiBaseUrl.replace(/\/$/, '');
  return `${root}/api/relatorio/cliente/${encodeURIComponent(ownerId)}/contexto`;
}

@Injectable({ providedIn: 'root' })
export class ClienteContextoService {
  private readonly http = inject(HttpClient);

  get(ownerId: string): Observable<ClienteContextoDto> {
    return this.http.get<ClienteContextoDto>(contextoUrl(ownerId));
  }

  save(ownerId: string, body: ClienteContextoSavePayload): Observable<ClienteContextoDto> {
    return this.http.post<ClienteContextoDto>(contextoUrl(ownerId), body);
  }
}
