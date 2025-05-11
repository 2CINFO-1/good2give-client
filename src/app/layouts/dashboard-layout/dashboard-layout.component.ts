import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserStateService } from '../../core/services/user-state.service';
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
      route: '/dashboard',
      roles: [
        UserRole.ADMIN,
        UserRole.DONATOR,
        UserRole.BENEFICIARY,
        UserRole.TRANSPORTER,
        UserRole.INSPECTOR,
      ],
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
    private authService: AuthService,
    private userState: UserStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userState.getCurrentUser();
    this.userSubscription = this.userState.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
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
  }

  canShowMenuItem(item: any): boolean {
    // Temporarily show all menu items while debugging user role issues
    return true;
    // When user authentication is properly working, use this:
    // return this.currentUser && item.roles.includes(this.currentUser.role);
  }
}
