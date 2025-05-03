import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';

// Guards
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../dashboard-home/dashboard-home.module').then(
            (m) => m.DashboardHomeModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'donations',
        loadChildren: () =>
          import('../donations/donations.module').then(
            (m) => m.DonationsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'collecte',
        loadChildren: () =>
          import('../collecte/collecte.module').then((m) => m.CollecteModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'TRANSPORTER'] },
      },
      {
        path: 'collectes',
        loadChildren: () =>
          import('../collectes/collectes.module').then(
            (m) => m.CollectesModule
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'TRANSPORTER'] },
      },
      {
        path: 'deliveries',
        loadChildren: () =>
          import('../deliveries/deliveries.module').then(
            (m) => m.DeliveriesModule
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'TRANSPORTER', 'BENEFICIARY'] },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../products/products.module').then((m) => m.ProductsModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR'] },
      },
      {
        path: 'stocks',
        loadChildren: () =>
          import('../stocks/stocks.module').then((m) => m.StocksModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR', 'WAREHOUSE'] },
      },
      {
        path: 'events',
        loadChildren: () =>
          import('../events/events.module').then((m) => m.EventsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'scraps',
        loadChildren: () =>
          import('../scraps/scraps.module').then((m) => m.ScrapsModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR', 'WAREHOUSE'] },
      },
      {
        path: 'reclamations',
        loadChildren: () =>
          import('../reclamations/reclamations.module').then(
            (m) => m.ReclamationsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'inspection',
        loadChildren: () =>
          import('../inspection/inspection.module').then(
            (m) => m.InspectionModule
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR'] },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then((m) => m.SettingsModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardNavComponent,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    DashboardFooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule {}
