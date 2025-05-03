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
    const token = localStorage.getItem('access_token');

    console.log('RoleGuard: Checking route', state.url);
    console.log('RoleGuard: Required roles', route.data['roles']);

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      console.log('RoleGuard: No token or expired token');
      this.toastr.error('Please log in to access this page');
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userRole = decodedToken?.user?.role;

    console.log('RoleGuard: User role', userRole);
    console.log('RoleGuard: Token data', decodedToken);

    if (!allowedRoles || allowedRoles.includes(userRole)) {
      console.log('RoleGuard: Access granted');
      return true;
    }

    console.log('RoleGuard: Access denied - role not in allowed roles');
    this.toastr.error('You do not have permission to access this page');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
