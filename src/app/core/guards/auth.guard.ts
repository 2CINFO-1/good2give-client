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
import { UserStateService } from '../services/user-state.service';
import { Observable, of, map, timeout, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService,
    private authService: AuthService,
    private userState: UserStateService
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
      // Bypass auth check for login and registration routes
      if (
        state.url.includes('/auth/login') ||
        state.url.includes('/auth/register') ||
        state.url.includes('/auth/verify-email') ||
        state.url.includes('/auth/forgot-password') ||
        state.url.includes('/auth/reset-password')
      ) {
        return true;
      }

      // Check token immediately and return synchronously to avoid blocking
      return this.checkAuthentication(state);
    } catch (error) {
      console.error('AuthGuard - Unexpected error:', error);
      return this.redirectToLogin(state.url);
    }
  }

  private checkAuthentication(state: RouterStateSnapshot): boolean | UrlTree {
    // Check localStorage first, then sessionStorage
    let token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');

    console.log('AuthGuard - Checking authentication for:', state.url);
    console.log('AuthGuard - Token found:', !!token);

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      console.log('AuthGuard - Valid token found, allowing access');
      return true;
    }

    console.log('AuthGuard - No valid token found, redirecting to login');
    return this.redirectToLogin(state.url);
  }

  private redirectToLogin(returnUrl: string): UrlTree {
    try {
      this.toastr.error('Please log in to access this page');
    } catch (toastError) {
      console.error('AuthGuard - Error showing toast:', toastError);
    }

    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl },
    });
  }
}
