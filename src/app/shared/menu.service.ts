import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly open = signal(false);
}
