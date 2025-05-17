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
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.toastr.error('Please log in to access this page');
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userRole = decodedToken?.user?.role;

    if (!allowedRoles || allowedRoles.includes(userRole)) {
      return true;
    }

    this.toastr.error('You do not have permission to access this page');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
