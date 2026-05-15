import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./mapa-clientes/mapa-clientes').then((m) => m.MapaClientesComponent),
  },
];
