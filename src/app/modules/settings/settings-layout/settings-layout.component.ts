import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.css'],
})
export class SettingsLayoutComponent {
  navItems = [
    { path: '/dashboard/settings/profile', label: 'Profile', icon: 'person' },
    { path: '/dashboard/settings/security', label: 'Security', icon: 'shield' },
    {
      path: '/dashboard/settings/notifications',
      label: 'Notifications',
      icon: 'notifications',
    },
  ];

  constructor() {}
}
