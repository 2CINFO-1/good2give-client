import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStateService } from '../services/user-state.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private userState: UserStateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip intercepting for non-API requests
    if (!request.url.startsWith(environment.apiUrl)) {
      return next.handle(request);
    }

    // Skip intercepting for auth endpoints (login, register, refresh)
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    // Check localStorage first, then sessionStorage
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          // Handle 401 (Unauthorized) - Token expired or invalid
          if (error.status === 401) {
            // Navigate to login if refresh token is not available
            const refreshToken =
              localStorage.getItem('refresh_token') ||
              sessionStorage.getItem('refresh_token');

            if (!refreshToken) {
              this.authService.clearAuthData();
              this.router.navigate(['/auth/login']);
              return throwError(() => error);
            }

            return this.handle401Error(request, next);
          }
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = [
      `${environment.apiUrl}/auth/login`,
      `${environment.apiUrl}/auth/register`,
      `${environment.apiUrl}/auth/refresh-tokens`,
      `${environment.apiUrl}/auth/forgot-password`,
      `${environment.apiUrl}/auth/reset-password`,
      `${environment.apiUrl}/auth/verify-email`,
      `${environment.apiUrl}/auth/google-auth`,
      `${environment.apiUrl}/auth/google/callback`,
    ];
    return authEndpoints.some((endpoint) => url.includes(endpoint));
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken =
        localStorage.getItem('refresh_token') ||
        sessionStorage.getItem('refresh_token');

      if (refreshToken) {
        return this.authService.refreshToken({ refreshToken }).pipe(
          switchMap(() => {
            this.isRefreshing = false;
            const newToken =
              localStorage.getItem('access_token') ||
              sessionStorage.getItem('access_token');

            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addToken(request, newToken!));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.clearAuthData();
            this.router.navigate(['/auth/login']);
            return throwError(() => error);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      } else {
        // No refresh token available, redirect to login
        this.isRefreshing = false;
        this.authService.clearAuthData();
        this.router.navigate(['/auth/login']);
        return throwError(() => new Error('No refresh token available'));
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token)))
    );
  }
}
