import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css'],
})
export class DashboardSidebarComponent implements OnInit {
  sidebarItems = [
    { title: 'Dashboard', route: '/dashboard', icon: 'fas fa-home' },
    { title: 'Donations', route: '/dashboard/donations', icon: 'fas fa-gift' },
    {
      title: 'Collections',
      route: '/dashboard/collectes',
      icon: 'fas fa-truck',
    },
    {
      title: 'Deliveries',
      route: '/dashboard/deliveries',
      icon: 'fas fa-shipping-fast',
    },
    { title: 'Products', route: '/dashboard/products', icon: 'fas fa-box' },
    { title: 'Stocks', route: '/dashboard/stocks', icon: 'fas fa-warehouse' },
    { title: 'Events', route: '/dashboard/events', icon: 'fas fa-calendar' },
    { title: 'Scraps', route: '/dashboard/scraps', icon: 'fas fa-trash' },
    {
      title: 'Reclamations',
      route: '/dashboard/reclamations',
      icon: 'fas fa-exclamation-circle',
    },
    {
      title: 'Inspection',
      route: '/dashboard/inspection',
      icon: 'fas fa-clipboard-check',
    },
    { title: 'Settings', route: '/dashboard/settings', icon: 'fas fa-cog' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
