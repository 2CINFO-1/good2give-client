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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('access_token');
    console.log(
      'AuthService loadCurrentUser - Token:',
      token ? 'exists' : 'not found'
    );

    // Check if token exists and is not expired
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);  // Decode the token
      console.log('AuthService loadCurrentUser - Decoded token:', decodedToken);

      // Assuming the user data is inside the token, either as part of a 'user' property or directly on the root.
      // Check if the 'user' is part of the decoded token or directly part of it
      const user = decodedToken.user || decodedToken;  // Adjusted to decode based on token structure
      console.log('AuthService loadCurrentUser - User object:', user);

      // Ensure we have a valid user object
      if (user) {
        this.currentUserSubject.next(user);  // Set the user object to BehaviorSubject
      } else {
        console.log('AuthService loadCurrentUser - No valid user data found in token');
      }
    } else {
      console.log('AuthService loadCurrentUser - Token expired or not found');
    }
  }



  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response && response.tokens) {
            this.handleAuthResponse(response);
          } else {
            console.error('Login failed, no tokens received');
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }


  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          if (response && response.tokens) {
            this.handleAuthResponse(response);
          } else {
            console.error('Registration failed, no tokens received');
          }
        }),
        catchError((error) => {
          console.error('Registration error:', error);
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
    const { user, tokens } = response;
    console.log('AuthService handleAuthResponse - User:', user);
    console.log('AuthService handleAuthResponse - Tokens:', tokens);

    localStorage.setItem('access_token', tokens.accessToken);  // New
localStorage.setItem('refresh_token', tokens.refreshToken);  // New

    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    console.log('AuthService getCurrentUser - Current user:', this.currentUserSubject.value);
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  hasRole(requiredRoles: string[]): boolean {
    const currentUser = this.getCurrentUser();
    console.log('AuthService hasRole - Current user:', currentUser);
    console.log('AuthService hasRole - Required roles:', requiredRoles);

    return currentUser ? requiredRoles.includes(currentUser.role) : false;
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
