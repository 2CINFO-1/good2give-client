import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
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

    const currentUser = this.authService.getCurrentUser();

    // If no user is logged in, return true and let auth guard handle it
    if (!currentUser) {
      console.log('NavigationService - No current user');
      return true;
    }

    const isVerified = !!currentUser.isEmailVerified;
    console.log(`NavigationService - User email verified: ${isVerified}`);

    if (!isVerified) {
      console.log(
        'NavigationService - Email not verified, redirecting to verify-email'
      );
      this.toastr.warning(
        'Please verify your email address to access the dashboard'
      );
      this.router.navigate(['/auth/verify-email']);
      return false;
    }

    return true;
  }
}
