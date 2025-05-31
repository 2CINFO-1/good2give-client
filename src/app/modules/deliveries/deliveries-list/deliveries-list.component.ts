import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DeliveryService } from 'src/app/core/services/delivery.service';
import { Delivery, DeliveryStatus } from 'src/app/core/models/delivery.model';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user.model';
import { FormsModule } from '@angular/forms';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-deliveries-list',
  templateUrl: './deliveries-list.component.html',
  styleUrls: ['./deliveries-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class DeliveriesListComponent implements OnInit {
  deliveries: Delivery[] = [];
  filteredDeliveries: Delivery[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  DeliveryStatus = DeliveryStatus;
  searchTerm = '';
  statusFilter = '';

  constructor(
    private deliveryService: DeliveryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('DeliveriesListComponent initialized');
    this.loadDeliveries();

    // Subscribe to route changes to refresh the list
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadDeliveries();
      }
    });
  }

  loadDeliveries(): void {
    this.loading = true;
    this.error = '';
    this.deliveryService.getAllDeliveries().subscribe({
      next: (data) => {
        console.log('Deliveries loaded:', data);
        this.deliveries = data;
        this.applyFilters();
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

  applyFilters(): void {
    this.filteredDeliveries = this.deliveries.filter((delivery) => {
      // Status filter
      const statusMatch =
        !this.statusFilter ||
        delivery.status.toLowerCase() === this.statusFilter.toLowerCase();

      // Search term filter
      const searchMatch =
        !this.searchTerm ||
        this.getCustomerName(delivery).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        delivery._id.toLowerCase().includes(this.searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  getCustomerName(delivery: Delivery): string {
    if (!delivery.beneficiary) return 'N/A';
    if (typeof delivery.beneficiary === 'string') return 'N/A';
    return (delivery.beneficiary as User).name || 'N/A';
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
    }
  }

  viewDeliveryDetails(id: string): void {
    this.router.navigate(['/dashboard/deliveries', id]);
  }

  createDelivery(): void {
    this.router.navigate(['/dashboard/deliveries/create']);
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}