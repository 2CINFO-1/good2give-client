import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery, DeliveryStatus } from '../../../models/delivery.model';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css'],
})
export class DeliveryDetailComponent implements OnInit {
  deliveryId: string | null = null;
  delivery: Delivery | null = null;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('id');
    if (this.deliveryId) {
      this.loadDelivery();
    } else {
      this.error = true;
      this.errorMessage = 'Delivery ID is missing';
      this.loading = false;
    }
  }

  loadDelivery(): void {
    if (!this.deliveryId) return;

    this.loading = true;
    this.error = false;

    this.deliveryService.getDeliveryById(this.deliveryId).subscribe({
      next: (data) => {
        this.delivery = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.errorMessage =
          err.message || 'Failed to load delivery details. Please try again.';
        this.loading = false;
      },
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/deliveries']);
  }

  updateStatus(newStatus: string): void {
    if (!this.deliveryId) return;

    this.loading = true;
    this.deliveryService
      .updateDeliveryStatus(this.deliveryId, newStatus as DeliveryStatus)
      .subscribe({
        next: (event) => {
          this.delivery = event;
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.errorMessage =
            err.message ||
            'Failed to update delivery status. Please try again.';
          this.loading = false;
        },
      });
  }
}
