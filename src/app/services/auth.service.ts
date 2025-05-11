import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  LogoutRequest,
} from '../models/auth.model';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(tap((response) => this.handleAuthentication(response)));
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((response) => this.handleAuthentication(response)));
  }

  // Google Sign-in method
  googleSignIn(token: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/google-auth`, { token })
      .pipe(tap((response) => this.handleAuthentication(response)));
  }

  refreshToken(
    refreshTokenData: RefreshTokenRequest
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh-token`, refreshTokenData)
      .pipe(tap((response) => this.handleAuthentication(response)));
  }

  logoutServer(logoutData: LogoutRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/logout`,
      logoutData
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.logoutServer({ refreshToken }).subscribe();
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }

  forgotPassword(
    email: ForgotPasswordRequest
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      email
    );
  }

  resetPassword(
    resetData: ResetPasswordRequest
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      resetData
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if the current user has a specific permission
  hasPermission(permission: string): boolean {
    const user = this.currentUserValue;
    if (!user) return false;

    // Simple role-based permissions
    switch (user.role) {
      case UserRole.ADMIN:
        // Admins have all permissions
        return true;
      case UserRole.DONATOR:
        // Donators can manage their own products
        if (permission.startsWith('products:')) {
          // In a real app, check if the product belongs to current user
          return permission !== 'products:delete';
        }
        return false;
      case UserRole.BENEFICIARY:
        // Beneficiaries typically don't manage products
        return false;
      case UserRole.TRANSPORTER:
      case UserRole.INSPECTOR:
        // Other roles don't manage products
        return false;
      default:
        return false;
    }
  }

  private handleAuthentication(response: AuthResponse): void {
    if (response && response.token && response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      this.currentUserSubject.next(response.user);
    }
  }
}
