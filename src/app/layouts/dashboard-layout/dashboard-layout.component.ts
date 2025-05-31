import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { UserStateService } from '../../core/services/user-state.service';
import { NavigationService } from '../../core/services/navigation.service';
import { User, UserRole } from '../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isSidebarOpen = true;
  UserRole = UserRole;
  private userSubscription: Subscription | null = null;

  menuItems = [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard/home',
      roles: [
        UserRole.ADMIN,
        UserRole.DONATOR,
        UserRole.BENEFICIARY,
        UserRole.TRANSPORTER,
        UserRole.INSPECTOR,
      ],
    },
    {
      name: 'User Management',
      icon: 'people',
      route: '/dashboard/users',
      roles: [UserRole.ADMIN],
    },
    {
      name: 'Collections',
      icon: 'local_shipping',
      route: '/dashboard/collectes',
      roles: [UserRole.ADMIN, UserRole.TRANSPORTER],
    },
    {
      name: 'Deliveries',
      icon: 'delivery_dining',
      route: '/dashboard/deliveries',
      roles: [UserRole.ADMIN, UserRole.TRANSPORTER, UserRole.BENEFICIARY],
    },
    {
      name: 'Products',
      icon: 'inventory_2',
      route: '/dashboard/products',
      roles: [UserRole.ADMIN, UserRole.INSPECTOR],
    },
    {
      name: 'Stocks',
      icon: 'inventory',
      route: '/dashboard/stocks',
      roles: [UserRole.ADMIN, UserRole.INSPECTOR],
    },
    {
      name: 'Events',
      icon: 'event',
      route: '/dashboard/events',
      roles: [UserRole.ADMIN, UserRole.BENEFICIARY],
    },
    {
      name: 'Scraps',
      icon: 'delete',
      route: '/dashboard/scraps',
      roles: [UserRole.ADMIN, UserRole.INSPECTOR],
    },
    {
      name: 'Reclamations',
      icon: 'report_problem',
      route: '/dashboard/reclamations',
      roles: [UserRole.ADMIN, UserRole.BENEFICIARY],
    },
    {
      name: 'Inspection',
      icon: 'fact_check',
      route: '/dashboard/inspection',
      roles: [UserRole.ADMIN, UserRole.INSPECTOR],
    },
    {
      name: 'Settings',
      icon: 'settings',
      route: '/dashboard/settings',
      roles: [
        UserRole.ADMIN,
        UserRole.DONATOR,
        UserRole.BENEFICIARY,
        UserRole.TRANSPORTER,
        UserRole.INSPECTOR,
      ],
    },
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private userState: UserStateService,
    private navigationService: NavigationService
  ) {
    // Handle the possibility that we are already in a state where we need to verify email
    // This check runs when the component is first created
    this.handleEmailVerification();
  }

  /**
   * Explicit handler for email verification to be sure the redirect happens
   */
  private handleEmailVerification(): void {
    try {
      // Use the NavigationService to check email verification status and handle redirects
      this.navigationService.checkEmailVerificationForRoute('/dashboard/home');
    } catch (error) {
      console.error(
        'DashboardLayoutComponent - Error checking email verification:',
        error
      );
    }
  }

  ngOnInit(): void {
    try {
      // Use the NavigationService to check email verification
      if (
        !this.navigationService.checkEmailVerificationForRoute(
          '/dashboard/home'
        )
      ) {
        return; // Stop initialization if email verification failed
      }

      // First set currentUser from userState if available
      this.currentUser = this.userState.getCurrentUser();

      // Subscribe to user updates
      this.userSubscription = this.userState.currentUser$.subscribe({
        next: (user) => {
          this.currentUser = user;

          // Re-check email verification when user state changes
          if (user && user.isEmailVerified === false) {
            this.handleEmailVerification();
          }
        },
        error: (err) => {
          console.error(
            'DashboardLayoutComponent - Error in user subscription:',
            err
          );
        },
      });
    } catch (error) {
      console.error('DashboardLayoutComponent - Error in ngOnInit:', error);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
    } catch (error) {
      console.error('DashboardLayoutComponent - Error unsubscribing:', error);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    try {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Logout error', error);
          // Force navigation even if API call fails
          this.router.navigate(['/auth/login']);
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Force navigation even if the method fails
      this.router.navigate(['/auth/login']);
    }
  }

  canShowMenuItem(item: any): boolean {
    // Temporarily show all menu items while debugging user role issues
    return true;
    // When user authentication is properly working, use this:
    // return this.currentUser && item.roles.includes(this.currentUser.role);
  }
}
