import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { RegisterComponent } from './modules/auth/register/register.component';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { EmailVerificationGuard } from './core/guards/email-verification.guard';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './modules/auth/verify-email/verify-email.component';

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
        path: 'verify-email',
        component: VerifyEmailComponent,
        // No AuthGuard here to prevent redirection loops
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
  // Redirect from /dashboard to /dashboard/home
  {
    path: 'dashboard',
    redirectTo: 'dashboard/home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // Important: EmailVerificationGuard first, then AuthGuard
    canActivate: [EmailVerificationGuard, AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/dashboard-home/dashboard-home.module').then(
            (m) => m.DashboardHomeModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'collectes',
        loadChildren: () =>
          import('./modules/collectes/collectes.module').then(
            (m) => m.CollectesModule
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'TRANSPORTER'] },
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
        loadChildren: () =>
          import('./modules/products/products.module').then(
            (m) => m.ProductsModule
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR'] },
      },
      {
        path: 'inspection',
        loadChildren: () =>
          import('./modules/inspection/inspection.module').then(
            (m) => m.InspectionModule
          ),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR'] },
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
        path: 'stocks',
        loadChildren: () =>
          import('./modules/stocks/stocks.module').then((m) => m.StocksModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR', 'WAREHOUSE'] },
      },
      {
        path: 'scraps',
        loadChildren: () =>
          import('./modules/scraps/scraps.module').then((m) => m.ScrapsModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN', 'INSPECTOR', 'WAREHOUSE'] },
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
