import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpBackend,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of, map } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
} from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserStateService } from './user-state.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private usersApiUrl = `${environment.apiUrl}/users`;

  // This HttpClient instance bypasses all interceptors
  private httpWithoutInterceptors: HttpClient;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private userState: UserStateService,
    private httpBackend: HttpBackend,
    private toastr: ToastrService
  ) {
    // Create an HttpClient that bypasses all interceptors to avoid circular dependencies
    this.httpWithoutInterceptors = new HttpClient(httpBackend);
    this.loadCurrentUser();
  }

  public loadCurrentUser(): void {
    try {
      // Try localStorage first, then sessionStorage as fallback
      let token = localStorage.getItem('access_token');
      let storageType = 'localStorage';

      if (!token) {
        token = sessionStorage.getItem('access_token');
        storageType = 'sessionStorage';
      }

      console.log(
        `AuthService loadCurrentUser - Token from ${storageType}:`,
        token ? 'exists' : 'not found'
      );

      if (!token) {
        console.log(
          'AuthService loadCurrentUser - No token found in either storage'
        );
        this.userState.setAuthLoaded();
        return;
      }

      try {
        if (this.jwtHelper.isTokenExpired(token)) {
          console.log('AuthService loadCurrentUser - Token is expired');
          this.userState.setAuthLoaded();
          return;
        }

        // Always fetch from the profile API
        console.log('AuthService loadCurrentUser - Fetching user profile');

        // Use httpWithoutInterceptors to avoid circular dependency
        this.httpWithoutInterceptors
          .get<User>(`${this.usersApiUrl}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError((error) => {
              console.error('Error fetching user profile:', error);

              // Check specifically for 403 errors related to email verification
              if (
                error instanceof HttpErrorResponse &&
                error.status === 403 &&
                error.error?.message?.includes('Email verification required')
              ) {
                // Try to get current user from state first
                const currentUser = this.userState.getCurrentUser();
                if (currentUser) {
                  // Update user with verified status set to false
                  const updatedUser = { ...currentUser };
                  updatedUser.isEmailVerified = false;
                  this.userState.setCurrentUser(updatedUser);
                }

                // Redirect to email verification
                this.toastr.warning('Please verify your email address');
                this.router.navigate(['/auth/verify-email']);

                // Don't clear tokens in this case
                return of(null);
              }

              // Clear invalid tokens if fetch fails with other errors
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              sessionStorage.removeItem('access_token');
              sessionStorage.removeItem('refresh_token');

              return of(null);
            })
          )
          .subscribe({
            next: (user) => {
              if (user && user._id) {
                console.log(
                  'AuthService loadCurrentUser - User profile loaded:',
                  user
                );
                this.userState.setCurrentUser(user);
                this.userState.setAuthLoaded();
              } else {
                console.error('Invalid user profile received from API');
                this.userState.setAuthLoaded();
              }
            },
            error: (err) => {
              console.error('Failed to load user profile:', err);
              this.userState.setAuthLoaded();
            },
            complete: () => {
              this.userState.setAuthLoaded();
            },
          });
      } catch (error) {
        console.error('AuthService loadCurrentUser - Error:', error);
        this.userState.setAuthLoaded();
      }
    } catch (error) {
      console.error('AuthService loadCurrentUser - Unexpected error:', error);
      this.userState.setAuthLoaded();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('AuthService login - Credentials:', {
      email: credentials.email,
      password: '***',
    });
    console.log('AuthService login - API URL:', `${this.apiUrl}/login`);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          console.log('AuthService login - Success response:', response);
          // First handle the initial auth response (store tokens only)
          this.handleAuthResponse(response);
        }),
        switchMap((response) => {
          // Then fetch the full user profile from the API using the client without interceptors
          // to avoid circular dependency issues
          const token =
            localStorage.getItem('access_token') ||
            sessionStorage.getItem('access_token');

          return this.httpWithoutInterceptors
            .get<User>(`${this.usersApiUrl}/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .pipe(
              tap((userProfile) => {
                console.log(
                  'AuthService login - User profile fetched:',
                  userProfile
                );
                // Update the global state with the complete user profile
                this.userState.setCurrentUser(userProfile);
              }),
              // Return the original login response to maintain the API contract
              map(() => response),
              catchError((profileError) => {
                console.error(
                  'AuthService login - Error fetching profile:',
                  profileError
                );
                // Check specifically for 403 errors related to email verification
                if (
                  profileError instanceof HttpErrorResponse &&
                  profileError.status === 403 &&
                  profileError.error?.message?.includes(
                    'Email verification required'
                  )
                ) {
                  // Get user from login response if possible
                  if (response.user) {
                    // Create a user with isEmailVerified set to false
                    const updatedUser = {
                      ...response.user,
                      isEmailVerified: false,
                    };
                    this.userState.setCurrentUser(updatedUser);
                  }

                  // Redirect to email verification
                  this.toastr.warning('Please verify your email address');
                  this.router.navigate(['/auth/verify-email']);

                  // Return original response
                  return of(response);
                }
                return of(response);
              })
            );
        }),
        catchError((error) => {
          console.error('AuthService login - Error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          console.log('AuthService register - Success response:', response);
          // First handle the initial auth response (store tokens only)
          this.handleAuthResponse(response);
        }),
        switchMap((response) => {
          // Then fetch the full user profile from the API using the client without interceptors
          // to avoid circular dependency issues
          const token =
            localStorage.getItem('access_token') ||
            sessionStorage.getItem('access_token');

          return this.httpWithoutInterceptors
            .get<User>(`${this.usersApiUrl}/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .pipe(
              tap((userProfile) => {
                console.log(
                  'AuthService register - User profile fetched:',
                  userProfile
                );
                // Update the global state with the complete user profile
                this.userState.setCurrentUser(userProfile);
              }),
              // Return the original register response to maintain the API contract
              map(() => response),
              catchError((profileError) => {
                console.error(
                  'AuthService register - Error fetching profile:',
                  profileError
                );
                // Check specifically for 403 errors related to email verification
                if (
                  profileError instanceof HttpErrorResponse &&
                  profileError.status === 403 &&
                  profileError.error?.message?.includes(
                    'Email verification required'
                  )
                ) {
                  // Get user from register response if possible
                  if (response.user) {
                    // Create a user with isEmailVerified set to false
                    const updatedUser = {
                      ...response.user,
                      isEmailVerified: false,
                    };
                    this.userState.setCurrentUser(updatedUser);
                  }

                  // Redirect to email verification
                  this.toastr.warning('Please verify your email address');
                  this.router.navigate(['/auth/verify-email']);

                  // Return original response
                  return of(response);
                }
                return of(response);
              })
            );
        }),
        catchError((error) => {
          console.error('AuthService register - Error:', error);
          return throwError(() => error);
        })
      );
  }

  // Google Sign-in method
  googleSignIn(token: string): Observable<AuthResponse> {
    console.log('AuthService googleSignIn - Token received');

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/google-auth`, { token })
      .pipe(
        tap((response) => {
          console.log('AuthService googleSignIn - Success response:', response);
          // First handle the initial auth response (store tokens only)
          this.handleAuthResponse(response);
        }),
        switchMap((response) => {
          // Then fetch the full user profile from the API using the client without interceptors
          // to avoid circular dependency issues
          const accessToken =
            localStorage.getItem('access_token') ||
            sessionStorage.getItem('access_token');

          return this.httpWithoutInterceptors
            .get<User>(`${this.usersApiUrl}/profile`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .pipe(
              tap((userProfile) => {
                console.log(
                  'AuthService googleSignIn - User profile fetched:',
                  userProfile
                );
                // Update the global state with the complete user profile
                this.userState.setCurrentUser(userProfile);
              }),
              // Return the original googleSignIn response to maintain the API contract
              map(() => response),
              catchError((profileError) => {
                console.error(
                  'AuthService googleSignIn - Error fetching profile:',
                  profileError
                );
                // Check specifically for 403 errors related to email verification
                if (
                  profileError instanceof HttpErrorResponse &&
                  profileError.status === 403 &&
                  profileError.error?.message?.includes(
                    'Email verification required'
                  )
                ) {
                  // Get user from googleSignIn response if possible
                  if (response.user) {
                    // Create a user with isEmailVerified set to false
                    const updatedUser = {
                      ...response.user,
                      isEmailVerified: false,
                    };
                    this.userState.setCurrentUser(updatedUser);
                  }

                  // Redirect to email verification
                  this.toastr.warning('Please verify your email address');
                  this.router.navigate(['/auth/verify-email']);

                  // Return original response
                  return of(response);
                }
                return of(response);
              })
            );
        }),
        catchError((error) => {
          console.error('AuthService googleSignIn - Error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(
    refreshTokenRequest: RefreshTokenRequest
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh-tokens`, refreshTokenRequest)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        // After getting new tokens, fetch the user profile
        switchMap((response) => {
          const token =
            localStorage.getItem('access_token') ||
            sessionStorage.getItem('access_token');

          if (!token) {
            return of(response);
          }

          return this.httpWithoutInterceptors
            .get<User>(`${this.usersApiUrl}/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .pipe(
              tap((userProfile) => {
                if (userProfile && userProfile._id) {
                  this.userState.setCurrentUser(userProfile);
                }
              }),
              map(() => response),
              catchError((error) => {
                // Check specifically for 403 errors related to email verification
                if (
                  error instanceof HttpErrorResponse &&
                  error.status === 403 &&
                  error.error?.message?.includes('Email verification required')
                ) {
                  // Try to get current user from state first
                  const currentUser = this.userState.getCurrentUser();
                  if (currentUser) {
                    // Update user with verified status set to false
                    const updatedUser = { ...currentUser };
                    updatedUser.isEmailVerified = false;
                    this.userState.setCurrentUser(updatedUser);
                  }

                  // Redirect to email verification
                  this.toastr.warning('Please verify your email address');
                  this.router.navigate(['/auth/verify-email']);

                  // Return the original response but don't clear tokens
                  return of(response);
                }

                // For other errors, continue with normal flow
                return of(response);
              })
            );
        }),
        catchError((error) => throwError(() => error))
      );
  }

  logout(): Observable<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    const request: LogoutRequest = { refreshToken: refreshToken || '' };

    // Clear local storage and subject regardless of API response
    this.clearAuthData();

    return this.http
      .post<void>(`${this.apiUrl}/logout`, request)
      .pipe(catchError((error) => throwError(() => error)));
  }

  private handleAuthResponse(response: AuthResponse): void {
    try {
      console.log('AuthService handleAuthResponse - Full response:', response);

      // Ensure response has the expected structure
      if (!response) {
        console.error(
          'AuthService handleAuthResponse - Response is null or undefined'
        );
        return;
      }

      const { tokens } = response;
      console.log('AuthService handleAuthResponse - Tokens:', tokens);

      // Check for different token formats and extract tokens accordingly
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      // Use consistent token format in line with backend
      if (tokens.accessToken && tokens.refreshToken) {
        // Backend format: { accessToken: '...', refreshToken: '...' }
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
        console.log(
          'AuthService handleAuthResponse - Found tokens in direct format'
        );
      } else {
        console.error(
          'AuthService handleAuthResponse - Invalid token format in response'
        );
        return;
      }

      // Test localStorage accessibility with a simple key
      try {
        localStorage.setItem('test_storage', 'test');
        const testValue = localStorage.getItem('test_storage');
        console.log(
          'AuthService handleAuthResponse - Test localStorage:',
          testValue
        );

        if (testValue !== 'test') {
          console.error(
            'AuthService handleAuthResponse - localStorage not working correctly'
          );
          // Try session storage instead
          if (accessToken && refreshToken) {
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('refresh_token', refreshToken);
            console.log(
              'AuthService handleAuthResponse - Tokens saved to sessionStorage instead'
            );
          }
        } else {
          // Use localStorage for token storage
          if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            console.log(
              'AuthService handleAuthResponse - Tokens saved to localStorage'
            );
          }
        }

        localStorage.removeItem('test_storage');
      } catch (storageError) {
        console.error(
          'AuthService handleAuthResponse - Error accessing localStorage:',
          storageError
        );

        // Fallback to sessionStorage
        try {
          if (accessToken && refreshToken) {
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('refresh_token', refreshToken);
            console.log(
              'AuthService handleAuthResponse - Tokens saved to sessionStorage as fallback'
            );
          }
        } catch (sessionError) {
          console.error(
            'AuthService handleAuthResponse - Error accessing sessionStorage:',
            sessionError
          );
        }
      }

      // Note: We no longer set user from JWT token data here
      // The user will only be set after fetching from /users/profile
    } catch (error) {
      console.error(
        'AuthService handleAuthResponse - Unexpected error:',
        error
      );
    }
  }

  public clearAuthData(): void {
    // Clear tokens from storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');

    // Clear state
    this.userState.clearState();

    console.log('AuthService clearAuthData - Auth data cleared');
  }

  getCurrentUser(): User | null {
    return this.userState.getCurrentUser();
  }

  updateCurrentUser(user: User): void {
    this.userState.setCurrentUser(user);
  }

  isAuthenticated(): boolean {
    return !!this.userState.getCurrentUser();
  }

  hasRole(requiredRoles: string[]): boolean {
    return this.userState.hasRole(requiredRoles);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(
    token: string,
    password: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { token, password }
    );
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-email`, {
      token,
    });
  }
}
