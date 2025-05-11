import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryService } from 'src/app/core/services/delivery.service';
import { Delivery, DeliveryStatus } from 'src/app/core/models/delivery.model';

@Component({
  selector: 'app-deliveries-list',
  templateUrl: './deliveries-list.component.html',
  styleUrls: ['./deliveries-list.component.css'],
})
export class DeliveriesListComponent implements OnInit {
  deliveries: Delivery[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  DeliveryStatus = DeliveryStatus;

  constructor(
    private deliveryService: DeliveryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('DeliveriesListComponent initialized');
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.loading = true;
    this.error = '';
    this.deliveryService.getAllDeliveries().subscribe({
      next: (data) => {
        console.log('Deliveries loaded:', data);
        this.deliveries = data;
        this.totalItems = data.length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load deliveries. Please try again.';
        this.loading = false;
        console.error('Error loading deliveries:', err);
      },
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
    }
  }

  viewDeliveryDetails(id: string): void {
    this.router.navigate(['/dashboard/deliveries', id]);
  }

  assignDelivery(id: string): void {
    this.router.navigate(['/dashboard/deliveries/assign', id]);
  }
}