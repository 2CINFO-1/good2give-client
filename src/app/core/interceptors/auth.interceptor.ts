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
    try {
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
          try {
            if (error instanceof HttpErrorResponse) {
              // Handle 401 (Unauthorized) - Token expired or invalid
              if (error.status === 401) {
                // Navigate to login if refresh token is not available
                let refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                  refreshToken = sessionStorage.getItem('refresh_token');
                }

                if (!refreshToken) {
                  console.log(
                    'AuthInterceptor - No refresh token available, redirecting to login'
                  );
                  this.authService.clearAuthData();
                  this.router.navigate(['/auth/login']);
                  return throwError(() => error);
                }

                return this.handle401Error(request, next);
              }

              // Handle 403 errors related to email verification at the interceptor level
              // Check for both the exact message and partial matches for robustness
              if (
                error.status === 403 &&
                (error.error?.message?.includes(
                  'Email verification required'
                ) ||
                  error.error?.message?.includes('verify your email') ||
                  error.error?.message?.includes('email verification'))
              ) {
                console.log(
                  'AuthInterceptor - Email verification required error detected:',
                  error.error?.message
                );

                // Get current user and update verification status
                const currentUser = this.userState.getCurrentUser();
                if (currentUser) {
                  try {
                    // Update user with verified status set to false
                    const updatedUser = { ...currentUser };
                    updatedUser.isEmailVerified = false;
                    this.userState.setCurrentUser(updatedUser);

                    console.log(
                      'AuthInterceptor - Updated user state with isEmailVerified = false'
                    );
                  } catch (userUpdateError) {
                    console.error(
                      'AuthInterceptor - Error updating user state:',
                      userUpdateError
                    );
                  }
                }

                // Notify user and redirect - ensure this always happens
                this.toastr.warning('Please verify your email address');

                // Force timeout to ensure the navigation happens after current execution
                setTimeout(() => {
                  this.router.navigate(['/auth/verify-email']);
                }, 0);

                // Return error but prevent further handling
                return throwError(() => error);
              }
            }
          } catch (interceptorError) {
            console.error('Error in AuthInterceptor:', interceptorError);
          }
          return throwError(() => error);
        })
      );
    } catch (outerError) {
      console.error('Outer error in AuthInterceptor:', outerError);
      // If there's an error in the interceptor itself, just pass the request through
      return next.handle(request);
    }
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
    try {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error adding token to request:', error);
      return request;
    }
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
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
              // Clear auth data and redirect to login on refresh failure
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
    } catch (error) {
      console.error('Error in handle401Error:', error);
      this.isRefreshing = false;
      this.authService.clearAuthData();
      this.router.navigate(['/auth/login']);
      return throwError(() => error);
    }
  }
}
