import { Routes } from '@angular/router';

import { ComercialPageComponent } from './pages/comercial/comercial-page.component';
import { ConfiguracoesPageComponent } from './pages/configuracoes/configuracoes-page.component';
import { CustomerDetailPageComponent } from './pages/customer-detail/customer-detail-page.component';
import { InsightsPageComponent } from './pages/insights/insights-page.component';
import { IntegracoesPageComponent } from './pages/integracoes/integracoes-page.component';
import { RadarPageComponent } from './pages/radar/radar-page.component';
import { MovideskPageComponent } from './pages/movidesk/movidesk-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'radar', pathMatch: 'full' },
  { path: 'radar', component: RadarPageComponent, title: 'Clientes - Mobiis Radar' },
  { path: 'comercial', component: ComercialPageComponent, title: 'Comercial Inteligente - Mobiis Radar' },
  { path: 'movidesk', component: MovideskPageComponent, title: 'Movidesk - Mobiis Radar' },
  { path: 'tickets', redirectTo: 'movidesk', pathMatch: 'full' },
  { path: 'insights', component: InsightsPageComponent, title: 'Insights IA - Mobiis Radar' },
  { path: 'integracoes', component: IntegracoesPageComponent, title: 'Integrações - Mobiis Radar' },
  { path: 'configuracoes', component: ConfiguracoesPageComponent, title: 'Configurações - Mobiis Radar' },
  { path: 'cliente/:id', component: CustomerDetailPageComponent, title: 'Cliente - Mobiis Radar' },
  { path: '**', redirectTo: '' },
];
