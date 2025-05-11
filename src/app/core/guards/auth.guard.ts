import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService,
    private authService: AuthService
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
      console.log(
        'AuthGuard canActivate - Checking authentication',
        'Route Path:',
        route.routeConfig?.path,
        'URL:',
        state.url
      );

      // Bypass auth check for login and registration routes
      if (
        state.url.includes('/auth/login') ||
        state.url.includes('/auth/register') ||
        state.url.includes('/auth/verify-email') ||
        state.url.includes('/auth/forgot-password') ||
        state.url.includes('/auth/reset-password')
      ) {
        console.log(
          'AuthGuard canActivate - Bypassing auth check for auth routes'
        );
        return true;
      }

      // Check localStorage first, then sessionStorage
      let token = localStorage.getItem('access_token');
      let storageType = 'localStorage';

      if (!token) {
        token = sessionStorage.getItem('access_token');
        storageType = 'sessionStorage';
      }

      console.log(
        `AuthGuard canActivate - Token from ${storageType}:`,
        !!token
      );

      if (token) {
        try {
          const isExpired = this.jwtHelper.isTokenExpired(token);
          console.log('AuthGuard canActivate - Token expired:', isExpired);

          if (!isExpired) {
            // Check if user exists in state
            const currentUser = this.authService.getCurrentUser();
            console.log(
              'AuthGuard canActivate - Current User:',
              currentUser ? 'exists' : 'null'
            );

            // Even if no user is found, we'll allow access as long as the token is valid
            // The app will attempt to load user data in this case
            console.log('AuthGuard canActivate - Authentication successful');
            return true;
          }
        } catch (error) {
          console.error(
            'AuthGuard canActivate - Error validating token:',
            error
          );
        }
      }

      console.log(
        'AuthGuard canActivate - Authentication failed, redirecting to login'
      );

      try {
        this.toastr.error('Please log in to access this page');
      } catch (toastError) {
        console.error('AuthGuard - Error showing toast:', toastError);
      }

      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
    } catch (error) {
      console.error('AuthGuard - Unexpected error:', error);

      // On error, redirect to login to be safe
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
