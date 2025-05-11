import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layouts
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Environment
import { environment } from '../environments/environment';

// Token getter function for JWT
export function tokenGetter() {
  // Check localStorage first
  let token = localStorage.getItem('access_token');
  let storageType = 'localStorage';

  // If not in localStorage, check sessionStorage
  if (!token) {
    token = sessionStorage.getItem('access_token');
    storageType = 'sessionStorage';
  }

  console.log(`AppModule tokenGetter - Token from ${storageType}:`, !!token);
  return token;
}

@NgModule({
  declarations: [AppComponent, DashboardLayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AuthModule,
    SharedModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [
          environment.apiUrl.replace('https://', '').replace('http://', ''),
        ],
        disallowedRoutes: [],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
