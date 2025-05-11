import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { RegisterComponent } from './modules/auth/register/register.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    children: [
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
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NoAuthGuard],
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [NoAuthGuard],
      },
      {
        path: 'callback',
        loadChildren: () =>
          import('./modules/auth/auth-callback/auth-callback.module').then(
            (m) => m.AuthCallbackModule
          ),
      },
    ],
  },
  // Keep old routes temporarily for backward compatibility
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    redirectTo: 'auth/register',
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    redirectTo: 'auth/forgot-password',
    pathMatch: 'full',
  },
  {
    path: 'reset-password',
    redirectTo: 'auth/reset-password',
    pathMatch: 'full',
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
        redirectTo: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'inspection',
        redirectTo: '',
        pathMatch: 'full',
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
        redirectTo: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'stocks',
        redirectTo: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      {
        path: 'scraps',
        redirectTo: '',
        pathMatch: 'full',
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
