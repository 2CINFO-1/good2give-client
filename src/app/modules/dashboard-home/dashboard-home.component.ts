import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { UserStateService } from '../../core/services/user-state.service';
import { NavigationService } from '../../core/services/navigation.service';

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
    private userState: UserStateService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    try {
      console.log('DashboardHomeComponent - Initializing');

      // Use NavigationService to check email verification with improved logging
      console.log(
        'DashboardHomeComponent - Explicitly checking email verification using NavigationService'
      );
      if (
        !this.navigationService.checkEmailVerificationForRoute(
          '/dashboard/home'
        )
      ) {
        console.log(
          'DashboardHomeComponent - Email verification check failed, redirect handled by NavigationService'
        );
        return;
      }

      console.log(
        'DashboardHomeComponent - Email verification check passed, continuing initialization'
      );

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
}
