import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { UserStateService } from '../../core/services/user-state.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  stats = {
    deliveries: 0,
    collections: 0,
    products: 0,
    events: 0,
  };

  isLoading = true;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private userState: UserStateService
  ) {}

  ngOnInit(): void {
    try {
      console.log('DashboardHomeComponent - Initializing');

      // Quick check for email verification
      setTimeout(() => {
        try {
          this.checkEmailVerification();
        } catch (error) {
          console.error(
            'DashboardHomeComponent - Error checking email verification:',
            error
          );
        }
      }, 300);

      // Simulate loading dashboard statistics
      setTimeout(() => {
        try {
          this.stats = {
            deliveries: 24,
            collections: 18,
            products: 156,
            events: 12,
          };
          this.isLoading = false;
        } catch (error) {
          console.error('DashboardHomeComponent - Error loading stats:', error);
          this.isLoading = false;
        }
      }, 1000);
    } catch (error) {
      console.error('DashboardHomeComponent - Error in ngOnInit:', error);
      this.isLoading = false;
    }
  }

  private checkEmailVerification(): void {
    try {
      console.log('DashboardHomeComponent - Checking email verification');

      // Try to get user from both services for reliability
      let user = null;

      try {
        user = this.authService.getCurrentUser();
        console.log(
          'DashboardHomeComponent - User from authService:',
          user ? 'exists' : 'null'
        );
      } catch (err) {
        console.error(
          'DashboardHomeComponent - Error getting user from authService:',
          err
        );
      }

      if (!user) {
        try {
          user = this.userState.getCurrentUser();
          console.log(
            'DashboardHomeComponent - User from userState:',
            user ? 'exists' : 'null'
          );
        } catch (err) {
          console.error(
            'DashboardHomeComponent - Error getting user from userState:',
            err
          );
        }
      }

      if (!user) {
        console.log(
          'DashboardHomeComponent - No user found, redirecting to login'
        );
        this.router.navigate(['/auth/login']);
        return;
      }

      console.log(
        'DashboardHomeComponent - User email verification status:',
        user.isEmailVerified
      );

      if (user.isEmailVerified === false) {
        console.log('DashboardHomeComponent - Email not verified, redirecting');
        try {
          this.toastr.warning('Please verify your email address');
        } catch (err) {
          console.error('DashboardHomeComponent - Error showing toast:', err);
        }
        this.router.navigate(['/auth/verify-email']);
      }
    } catch (error) {
      console.error(
        'DashboardHomeComponent - Error in checkEmailVerification:',
        error
      );
      // Don't redirect on error to prevent redirection loops
    }
  }
}
