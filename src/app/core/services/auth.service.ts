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

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('AuthService loadCurrentUser - Decoded token:', decodedToken);

      // Assuming the user structure is in the root of the token or in a 'user' property
      const user = decodedToken.user || decodedToken;
      console.log('AuthService loadCurrentUser - User object:', user);

      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => throwError(() => error))
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

    localStorage.setItem('access_token', tokens.access.token);
    localStorage.setItem('refresh_token', tokens.refresh.token);
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
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

    return !!currentUser && requiredRoles.includes(currentUser.role);
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
