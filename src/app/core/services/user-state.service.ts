import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private authLoadedSubject = new BehaviorSubject<boolean>(false);
  public authLoaded$ = this.authLoadedSubject.asObservable();

  constructor() {}

  /**
   * Updates the current user in the global state
   * @param user The user object or null if logging out
   */
  setCurrentUser(user: User | null): void {
    console.log('UserStateService - Setting current user:', user);
    this.currentUserSubject.next(user);
    this.authLoadedSubject.next(true);
  }

  /**
   * Get the current user from the global state
   * @returns The current user object or null if not authenticated
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Check if user has any of the required roles
   * @param requiredRoles Array of role names
   * @returns True if user has any of the required roles
   */
  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }

  /**
   * Mark the auth state as loaded (whether authenticated or not)
   */
  setAuthLoaded(): void {
    this.authLoadedSubject.next(true);
  }

  /**
   * Clear the current user state (used during logout)
   */
  clearState(): void {
    this.currentUserSubject.next(null);
  }
}
