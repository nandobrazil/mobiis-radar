import { Routes } from '@angular/router';

import { ComercialPageComponent } from './pages/comercial/comercial-page.component';
import { ConfiguracoesPageComponent } from './pages/configuracoes/configuracoes-page.component';
import { CustomerDetailPageComponent } from './pages/customer-detail/customer-detail-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { ExecutivoPageComponent } from './pages/executivo/executivo-page.component';
import { InsightsPageComponent } from './pages/insights/insights-page.component';
import { IntegracoesPageComponent } from './pages/integracoes/integracoes-page.component';
import { RadarPageComponent } from './pages/radar/radar-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent, title: 'Dashboard - Mobiis Radar' },
  { path: 'radar', component: RadarPageComponent, title: 'Radar de Clientes - Mobiis Radar' },
  { path: 'comercial', component: ComercialPageComponent, title: 'Comercial Inteligente - Mobiis Radar' },
  { path: 'executivo', component: ExecutivoPageComponent, title: 'Executivo - Mobiis Radar' },
  { path: 'insights', component: InsightsPageComponent, title: 'Insights IA - Mobiis Radar' },
  { path: 'integracoes', component: IntegracoesPageComponent, title: 'Integracoes - Mobiis Radar' },
  { path: 'configuracoes', component: ConfiguracoesPageComponent, title: 'Configuracoes - Mobiis Radar' },
  { path: 'cliente/:id', component: CustomerDetailPageComponent, title: 'Cliente - Mobiis Radar' },
  { path: '**', redirectTo: '' },
];
