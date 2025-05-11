import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Initiates the Google OAuth login process
   * @returns The URL to redirect to for Google authentication
   */
  getGoogleAuthUrl(): string {
    return `${this.apiUrl}/google`;
  }

  /**
   * Process tokens received from OAuth callback
   * @param accessToken Access token from OAuth callback
   * @param refreshToken Refresh token from OAuth callback
   * @returns Whether tokens were stored successfully
   */
  storeOAuthTokens(accessToken: string, refreshToken: string): boolean {
    try {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      return true;
    } catch (error) {
      console.error(
        'OAuthService - Error storing tokens in localStorage:',
        error
      );

      try {
        // Fallback to sessionStorage
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
        return true;
      } catch (sessionError) {
        console.error(
          'OAuthService - Error storing tokens in sessionStorage:',
          sessionError
        );
        return false;
      }
    }
  }

  /**
   * Exchange an authorization code for tokens
   * @param code Authorization code from OAuth provider
   * @returns Observable with auth response
   */
  exchangeCodeForTokens(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google/exchange`, {
      code,
    });
  }
}
