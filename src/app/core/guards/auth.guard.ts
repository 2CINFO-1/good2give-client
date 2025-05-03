import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard canActivate - Checking authentication');
    const token = localStorage.getItem('access_token');
    console.log('AuthGuard canActivate - Token exists:', !!token);

    if (token) {
      try {
        const isExpired = this.jwtHelper.isTokenExpired(token);
        console.log('AuthGuard canActivate - Token expired:', isExpired);

        if (!isExpired) {
          console.log('AuthGuard canActivate - Authentication successful');
          return true;
        }
      } catch (error) {
        console.error('AuthGuard canActivate - Error validating token:', error);
      }
    }

    console.log(
      'AuthGuard canActivate - Authentication failed, redirecting to login'
    );
    this.toastr.error('Please log in to access this page');
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
