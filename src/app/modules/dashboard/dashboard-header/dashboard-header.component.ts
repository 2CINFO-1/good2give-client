import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
})
export class DashboardHeaderComponent implements OnInit {
  userMenuOpen = false;
  notificationsOpen = false;
  user = {
    name: 'User',
    email: 'user@example.com',
    avatar: 'assets/avatar.png',
  };

  notifications = [
    {
      id: '1',
      message: 'New delivery scheduled',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'Inspection report ready',
      time: '1 hour ago',
      read: false,
    },
    { id: 3, message: 'Event starting soon', time: '3 hours ago', read: true },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get current user data
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = {
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar || 'assets/avatar.png',
      };
    }
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some((n) => !n.read);
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.notificationsOpen = false;
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) {
      this.userMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success('You have been logged out successfully');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        // Still navigate to login even if there's an error with the logout API
        this.toastr.error('Logout failed, but session has been cleared');
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
