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

      // Check localStorage first, then sessionStorage
      let token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token');

      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      }

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
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
