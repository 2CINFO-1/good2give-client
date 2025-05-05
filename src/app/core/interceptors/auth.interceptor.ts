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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService) {}

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
    let token = localStorage.getItem('access_token');
    let storageType = 'localStorage';

    if (!token) {
      token = sessionStorage.getItem('access_token');
      storageType = 'sessionStorage';
    }

    console.log(`AuthInterceptor - Token from ${storageType}:`, !!token);

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = [
      `${environment.apiUrl}/login`,
      `${environment.apiUrl}/register`,
      `${environment.apiUrl}/refresh-tokens`,
      `${environment.apiUrl}/forgot-password`,
      `${environment.apiUrl}/reset-password`,
      `${environment.apiUrl}/verify-email`,
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

      // Check localStorage first, then sessionStorage
      let refreshToken = localStorage.getItem('refresh_token');
      let storageType = 'localStorage';

      if (!refreshToken) {
        refreshToken = sessionStorage.getItem('refresh_token');
        storageType = 'sessionStorage';
      }

      console.log(
        `AuthInterceptor handle401Error - Refresh token from ${storageType}:`,
        !!refreshToken
      );

      if (refreshToken) {
        return this.authService.refreshToken({ refreshToken }).pipe(
          switchMap(() => {
            this.isRefreshing = false;

            // Check both storage locations for the new token
            let newToken = localStorage.getItem('access_token');
            let tokenStorageType = 'localStorage';

            if (!newToken) {
              newToken = sessionStorage.getItem('access_token');
              tokenStorageType = 'sessionStorage';
            }

            console.log(
              `AuthInterceptor handle401Error - New token from ${tokenStorageType}:`,
              !!newToken
            );

            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addToken(request, newToken!));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => error);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token)))
    );
  }
}
