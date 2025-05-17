import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private userState: UserStateService
  ) {}

  /**
   * Check if the current user has a verified email and redirect to verify-email page if not
   * Use this for routes that need special handling like /dashboard/home
   * @returns boolean indicating if user can proceed (true) or is being redirected (false)
   */
  checkEmailVerificationForRoute(route: string): boolean {
    console.log(
      `NavigationService - Checking email verification for route: ${route}`
    );

    // Try to get user from both AuthService and UserStateService for reliability
    let currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      currentUser = this.userState.getCurrentUser();
    }

    // If no user is logged in, return true and let auth guard handle it
    if (!currentUser) {
      console.log('NavigationService - No current user');
      return true;
    }

    // If isEmailVerified is explicitly false, redirect
    if (currentUser.isEmailVerified === false) {
      console.log(
        'NavigationService - Email not verified (explicitly false), redirecting to verify-email'
      );
      this.toastr.warning(
        'Please verify your email address to access the dashboard'
      );
      this.router.navigate(['/auth/verify-email']);
      return false;
    }

    // If isEmailVerified is undefined or null, assume not verified for security
    // This handles cases where the property might not be present
    if (currentUser.isEmailVerified !== true) {
      console.log(
        'NavigationService - Email verification status is undefined, redirecting to verify-email'
      );
      this.toastr.warning(
        'Please verify your email address to access the dashboard'
      );
      this.router.navigate(['/auth/verify-email']);
      return false;
    }

    console.log(`NavigationService - User email verified: true`);
    return true;
  }
}
