import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import type { BrasilApiCnpj } from './brasil-api-cnpj.types';

const BRASIL_API_CNPJ_BASE = 'https://brasilapi.com.br/api/cnpj/v1';

@Injectable({ providedIn: 'root' })
export class BrasilApiCnpjService {
  private readonly http = inject(HttpClient);

  /** Somente dígitos no path, conforme a [API Brasil API CNPJ](https://brasilapi.com.br/docs#tag/CNPJ). */
  getCnpj(raw: string): Observable<BrasilApiCnpj> {
    const digits = raw.replace(/\D/g, '');
    return this.http.get<BrasilApiCnpj>(`${BRASIL_API_CNPJ_BASE}/${digits}`);
  }
}
