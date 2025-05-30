import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
