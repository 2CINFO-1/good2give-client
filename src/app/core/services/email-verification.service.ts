import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationService {
  private apiUrl = `${environment.apiUrl}/mail`;

  constructor(private http: HttpClient) {}

  /**
   * Request a new verification email
   * @returns Observable with response message
   */
  requestVerificationEmail(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      `${this.apiUrl}/request-verification`
    );
  }

  /**
   * Verify email with verification code
   * @param code The verification code
   * @returns Observable with response message
   */
  verifyEmail(code: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-email`, {
      code,
    });
  }
}
