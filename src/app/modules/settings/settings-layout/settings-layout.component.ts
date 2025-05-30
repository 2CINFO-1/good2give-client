import { Component, OnInit } from '@angular/core';
import { User, UserRole } from '../../../core/models/user.model';
import { UserStateService } from '../../../core/services/user-state.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.css'],
})
export class SettingsLayoutComponent implements OnInit {
  navItems: NavItem[] = [
    {
      path: '/dashboard/settings/profile',
      label: 'Profile',
      icon: 'person',
    },
    {
      path: '/dashboard/settings/security',
      label: 'Security',
      icon: 'shield',
    },
    {
      path: '/dashboard/settings/notifications',
      label: 'Notifications',
      icon: 'notifications',
    },
  ];

  currentUser: User | null = null;

  constructor(private userState: UserStateService) {}

  ngOnInit(): void {
    this.currentUser = this.userState.getCurrentUser();
    this.filterNavItems();
  }

  filterNavItems(): void {
    // This method can be expanded to filter navigation items based on user roles
    // For now, all users have access to all settings sections
    this.navItems = this.navItems.filter((item) => {
      // If no roles specified, item is available to all
      if (!item.roles) {
        return true;
      }

      // If user has one of the required roles
      return this.currentUser && item.roles.includes(this.currentUser.role);
    });
  }
}
