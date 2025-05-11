import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  User,
  UpdatePasswordRequest,
  UpdateUserProfileRequest,
  UserRequest,
  UserRole,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get all users with optional pagination
   * @param page Page number
   * @param limit Items per page
   */
  getUsers(page: number = 1, limit: number = 10): Observable<User[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<User[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching users', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a user by ID
   * @param id User ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching user with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new user
   * @param user User data
   */
  createUser(user: UserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError((error) => {
        console.error('Error creating user', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing user
   * @param id User ID
   * @param user User data to update
   */
  updateUser(id: string, user: Partial<UserRequest>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError((error) => {
        console.error(`Error updating user with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a user
   * @param id User ID
   */
  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting user with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get user profile
   */
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      catchError((error) => {
        console.error('Error fetching user profile', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update user profile
   * @param profileData Profile data
   */
  updateUserProfile(profileData: UpdateUserProfileRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, profileData).pipe(
      catchError((error) => {
        console.error('Error updating user profile', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update user password
   * @param passwordData Password data
   */
  updatePassword(
    passwordData: UpdatePasswordRequest
  ): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(`${this.apiUrl}/password`, passwordData)
      .pipe(
        catchError((error) => {
          console.error('Error updating password', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Request password reset
   * @param data Password reset request data
   */
  requestPasswordReset(
    data: RequestPasswordResetRequest
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/forgot-password`, data)
      .pipe(
        catchError((error) => {
          console.error('Error requesting password reset', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Reset password with token
   * @param data Reset password data
   */
  resetPassword(data: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/reset-password`, data)
      .pipe(
        catchError((error) => {
          console.error('Error resetting password', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get users by role
   * @param role User role
   */
  getUsersByRole(role: UserRole): Observable<User[]> {
    const params = new HttpParams().set('role', role);
    return this.http.get<User[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching users with role ${role}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search users
   * @param query Search query
   */
  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError((error) => {
        console.error(`Error searching users with query ${query}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get users by specific roles
   */
  getDonators(): Observable<User[]> {
    return this.getUsersByRole(UserRole.DONATOR);
  }

  getBeneficiaries(): Observable<User[]> {
    return this.getUsersByRole(UserRole.BENEFICIARY);
  }

  getTransporters(): Observable<User[]> {
    return this.getUsersByRole(UserRole.TRANSPORTER);
  }

  getInspectors(): Observable<User[]> {
    return this.getUsersByRole(UserRole.INSPECTOR);
  }

  getAdmins(): Observable<User[]> {
    return this.getUsersByRole(UserRole.ADMIN);
  }
}
