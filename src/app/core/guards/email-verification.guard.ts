import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    try {
      // Always allow access to auth routes
      const url = state.url;
      console.log(`EmailVerificationGuard - Checking route: ${url}`);

      // Special routes that should always be accessible
      const bypassRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/verify-email',
        '/auth/forgot-password',
        '/auth/reset-password',
      ];

      if (bypassRoutes.some((route) => url.includes(route))) {
        console.log(`EmailVerificationGuard - Bypassing check for ${url}`);
        return true;
      }

      // Get current user safely
      const currentUser = this.authService.getCurrentUser();

      // If no user is logged in, let the auth guard handle redirection
      if (!currentUser) {
        console.log(
          'EmailVerificationGuard - No current user, allowing navigation to continue'
        );
        return true;
      }

      console.log(
        'EmailVerificationGuard - User found, checking email verification'
      );
      console.log(
        'EmailVerificationGuard - Email verification status:',
        currentUser.isEmailVerified
      );

      const isVerified = !!currentUser.isEmailVerified;

      if (!isVerified) {
        console.log('EmailVerificationGuard - Email not verified, redirecting');

        // Only show the toast if we're actually redirecting from a protected route
        if (!url.includes('/auth/verify-email')) {
          try {
            this.toastr.warning('Please verify your email address to continue');
          } catch (error) {
            console.error(
              'EmailVerificationGuard - Error showing toast:',
              error
            );
          }
        }

        return this.router.createUrlTree(['/auth/verify-email']);
      }

      console.log('EmailVerificationGuard - Email verified, allowing access');
      return true;
    } catch (error) {
      // Log the error but don't block navigation
      console.error('EmailVerificationGuard - Unexpected error:', error);
      return true;
    }
  }
}
