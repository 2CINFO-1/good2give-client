import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ModulePlaceholderComponent } from './shared/components/module-placeholder/module-placeholder.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'reclamations',
        loadChildren: () =>
          import('./modules/reclamations/reclamations.module').then(
            (m) => m.ReclamationsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'products',
        component: ModulePlaceholderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'inspection',
        component: ModulePlaceholderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./modules/events/events.module').then((m) => m.EventsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'deliveries',
        loadChildren: () =>
          import('./modules/deliveries/deliveries.module').then(
            (m) => m.DeliveriesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'collectes',
        component: ModulePlaceholderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'stocks',
        component: ModulePlaceholderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'scraps',
        component: ModulePlaceholderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
