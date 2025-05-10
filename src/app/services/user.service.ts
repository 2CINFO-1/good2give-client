import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  User,
  UserProfile,
  UpdatePasswordRequest,
  UpdateUserProfileRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateUserProfile(
    profile: UpdateUserProfileRequest
  ): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, profile);
  }

  updatePassword(
    passwordData: UpdatePasswordRequest
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/password`,
      passwordData
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Role-specific user queries
  getDonators(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/donator`);
  }

  getBeneficiaries(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/beneficiary`);
  }

  getTransporters(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/transporter`);
  }

  getInspectors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/inspector`);
  }

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/admin`);
  }
}
