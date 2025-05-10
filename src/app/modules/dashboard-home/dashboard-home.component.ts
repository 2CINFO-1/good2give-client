import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
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
  }
}
