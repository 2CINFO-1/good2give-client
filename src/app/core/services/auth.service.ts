import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private userState: UserStateService
  ) {
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

        const decodedToken = this.jwtHelper.decodeToken(token);
        console.log(
          'AuthService loadCurrentUser - Decoded token:',
          decodedToken
        );

        // Try different possible structures based on the API response
        let user = null;

        if (decodedToken.user) {
          // If user data is nested in a 'user' property
          user = decodedToken.user;
        } else if (decodedToken.sub) {
          // If token contains standard JWT claims
          user = {
            _id: decodedToken.sub,
            email: decodedToken.email || '',
            name: decodedToken.name || '',
            role: decodedToken.role || '',
          };
        } else {
          // Try using the token directly as user data
          user = decodedToken;
        }

        console.log(
          'AuthService loadCurrentUser - Extracted user object:',
          user
        );

        if (user && user._id) {
          this.userState.setCurrentUser(user);
          console.log(
            `AuthService loadCurrentUser - User set successfully from ${storageType}`
          );
        } else {
          console.error(
            'AuthService loadCurrentUser - Could not extract valid user from token'
          );
          this.userState.setAuthLoaded();
        }
      } catch (tokenError) {
        console.error(
          'AuthService loadCurrentUser - Error parsing token:',
          tokenError
        );
        // Clear invalid tokens from both storages
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
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
          this.handleAuthResponse(response);
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
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => throwError(() => error))
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
          this.handleAuthResponse(response);
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
      let accessToken = null;
      let refreshToken = null;

      if (tokens.accessToken && tokens.refreshToken) {
        // Format: { accessToken: '...', refreshToken: '...' }
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
        console.log('AuthService handleAuthResponse - Found flat token format');
      } else if (tokens.access?.token && tokens.refresh?.token) {
        // Format: { access: { token: '...' }, refresh: { token: '...' } }
        accessToken = tokens.access.token;
        refreshToken = tokens.refresh.token;
        console.log(
          'AuthService handleAuthResponse - Found nested token format'
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
          sessionStorage.setItem('access_token', accessToken);
          sessionStorage.setItem('refresh_token', refreshToken);
          console.log(
            'AuthService handleAuthResponse - Tokens saved to sessionStorage instead'
          );
        } else {
          // localStorage is working, proceed as normal
          localStorage.removeItem('test_storage');
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          console.log(
            'AuthService handleAuthResponse - Tokens saved to localStorage'
          );
        }

        // Set the user in the global state
        this.userState.setCurrentUser(user);
      } catch (storageError) {
        console.error(
          'AuthService handleAuthResponse - Error accessing localStorage:',
          storageError
        );

        // Fallback to sessionStorage
        try {
          sessionStorage.setItem('access_token', accessToken);
          sessionStorage.setItem('refresh_token', refreshToken);
          console.log(
            'AuthService handleAuthResponse - Tokens saved to sessionStorage (fallback)'
          );

          // Set the user in the global state
          this.userState.setCurrentUser(user);
        } catch (sessionStorageError) {
          console.error(
            'AuthService handleAuthResponse - Error accessing sessionStorage:',
            sessionStorageError
          );
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

  isAuthenticated(): boolean {
    return this.userState.isAuthenticated();
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
