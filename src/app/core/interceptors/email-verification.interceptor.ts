import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { UserStateService } from '../services/user-state.service';

@Injectable()
export class EmailVerificationInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private userState: UserStateService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        try {
          // Check specifically for 403 errors related to email verification
          if (
            error instanceof HttpErrorResponse &&
            error.status === 403 &&
            error.error?.message?.includes('Email verification required')
          ) {
            // Update user state
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
              try {
                // Create a safe copy of the user with verified status set to false
                const safeUserCopy = { ...currentUser };
                safeUserCopy.isEmailVerified = false;

                // Update the user state
                this.userState.setCurrentUser(safeUserCopy);

                // Notify user and redirect
                this.toastr.warning('Please verify your email address');
                this.router.navigate(['/auth/verify-email']);
              } catch (userUpdateError) {
                console.error('Error updating user state:', userUpdateError);
              }
            }
          }
        } catch (interceptorError) {
          // Log interceptor errors but don't block the app
          console.error(
            'Error in EmailVerificationInterceptor:',
            interceptorError
          );
        }

        // Always pass the error along
        return throwError(() => error);
      })
    );
  }
}
