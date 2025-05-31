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
    // Try to get user from both AuthService and UserStateService for reliability
    let currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      currentUser = this.userState.getCurrentUser();
    }

    // If no user is logged in, return true and let auth guard handle it
    if (!currentUser) {
      console.log(
        'NavigationService - No user found, letting auth guard handle it'
      );
      return true;
    }

    console.log('NavigationService - Checking email verification for user:', {
      email: currentUser.email,
      isEmailVerified: currentUser.isEmailVerified,
    });

    // If isEmailVerified is not explicitly true (either false or undefined), redirect to verify
    if (currentUser.isEmailVerified !== true) {
      console.log(
        'NavigationService - Email not verified, redirecting to verification page'
      );
      this.toastr.warning('Please verify your email address to continue');
      this.router.navigate(['/auth/verify-email'], {
        queryParams: { email: currentUser.email },
      });
      return false;
    }

    console.log('NavigationService - Email verified, allowing access');
    return true;
  }
}
