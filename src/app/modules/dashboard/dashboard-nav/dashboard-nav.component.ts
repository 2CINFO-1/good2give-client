import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.css'],
})
export class DashboardNavComponent implements OnInit {
  navItems = [
    { title: 'Dashboard', route: '/dashboard', icon: 'fas fa-home' },
    { title: 'Donations', route: '/dashboard/donations', icon: 'fas fa-gift' },
    {
      title: 'Collections',
      route: '/dashboard/collectes',
      icon: 'fas fa-truck',
    },
    { title: 'Products', route: '/dashboard/products', icon: 'fas fa-box' },
    { title: 'Events', route: '/dashboard/events', icon: 'fas fa-calendar' },
    { title: 'Settings', route: '/dashboard/settings', icon: 'fas fa-cog' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
