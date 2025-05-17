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
      // Check email verification first
      if (
        !this.navigationService.checkEmailVerificationForRoute(
          '/dashboard/home'
        )
      ) {
        return; // Stop initialization if email verification failed
      }

      // Simulate loading dashboard statistics
      setTimeout(() => {
        this.stats = {
          deliveries: 24,
          collections: 18,
          products: 156,
          events: 12,
        };
        this.isLoading = false;
      }, 1000);
    } catch (error) {
      console.error('DashboardHomeComponent - Error in ngOnInit:', error);
      this.isLoading = false;
    }
  }
}
