import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
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
    private httpBackend: HttpBackend
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

        // Instead of decoding the token first, let's directly call the API
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

              // If API call fails, only then use token data as fallback
              try {
                // We've already checked token isn't null, but TypeScript doesn't know that
                // so we need to do an additional null check
                if (token) {
                  const decodedToken = this.jwtHelper.decodeToken(token);
                  console.log(
                    'AuthService loadCurrentUser - Using token data as fallback'
                  );

                  const userId = decodedToken._id;
                  if (userId) {
                    const basicUser = {
                      _id: userId,
                      email: decodedToken.email || '',
                      name: decodedToken.name || '',
                      role: decodedToken.role || '',
                    };
                    this.userState.setCurrentUser(basicUser);
                  } else {
                    console.error('Could not extract user ID from token');
                  }
                }
              } catch (tokenError) {
                console.error('Error decoding token:', tokenError);

                // Clear invalid tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('refresh_token');
              }

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
          // First handle the initial auth response (store tokens and basic user info)
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
                // If profile fetch fails, we already set basic user info in handleAuthResponse
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
          // First handle the initial auth response (store tokens and basic user info)
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
                // If profile fetch fails, we already set basic user info in handleAuthResponse
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
          // First handle the initial auth response (store tokens and basic user info)
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
                // If profile fetch fails, we already set basic user info in handleAuthResponse
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

      const { user, tokens } = response;
      console.log('AuthService handleAuthResponse - User:', user);
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

      // The user object comes directly from the backend response
      // We'll still use the full profile API to ensure complete data
      // But we'll set basic user info immediately for better UX
      if (user && user._id) {
        this.userState.setCurrentUser(user);
      } else if (accessToken) {
        // If no user object in response, we'll decode from token
        try {
          const decodedToken = this.jwtHelper.decodeToken(accessToken);
          if (decodedToken && decodedToken._id) {
            const basicUser = {
              _id: decodedToken._id,
              email: decodedToken.email || '',
              role: decodedToken.role || '',
              name: decodedToken.name || '', // This may not be in the token
            };
            this.userState.setCurrentUser(basicUser);
          }
        } catch (decodeError) {
          console.error('Error decoding token for user data:', decodeError);
        }
      }
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
