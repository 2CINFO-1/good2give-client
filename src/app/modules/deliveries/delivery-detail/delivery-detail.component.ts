import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { Delivery, DeliveryStatus } from '../../../core/models/delivery.model';
import { Location } from '@angular/common';

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
  DeliveryStatus = DeliveryStatus;

  readonly DELIVERY_STATUS = {
    PENDING: DeliveryStatus.PENDING,
    IN_PROGRESS: DeliveryStatus.IN_PROGRESS,
    DELIVERED: DeliveryStatus.DELIVERED,
    CANCELED: DeliveryStatus.CANCELED,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deliveryService: DeliveryService,
    private location: Location
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

  formatDate(date: Date | string | undefined): string {
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

  updateStatus(status: DeliveryStatus): void {
    if (!this.delivery || !this.delivery._id) return;

    this.loading = true;
    this.deliveryService
      .updateDelivery(this.delivery._id, { status })
      .subscribe({
        next: (updatedDelivery) => {
          this.delivery = updatedDelivery;
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.errorMessage = 'Failed to update delivery status';
          this.loading = false;
          console.error('Error updating delivery status:', err);
        },
      });
  }

  getDeliveryPersonName(): string {
    if (!this.delivery || !this.delivery.transporter) return 'Not assigned';
    return typeof this.delivery.transporter === 'object'
      ? this.delivery.transporter.name || 'Unknown'
      : 'Unknown';
  }

  getDeliveryPersonId(): string {
    if (!this.delivery || !this.delivery.transporter) return 'N/A';
    return typeof this.delivery.transporter === 'string'
      ? this.delivery.transporter
      : this.delivery.transporter._id || 'N/A';
  }

  getDonatorName(): string {
    if (!this.delivery || !this.delivery.donator) return 'Unknown';
    return typeof this.delivery.donator === 'object'
      ? this.delivery.donator.name || 'Unknown'
      : 'Unknown';
  }

  getBeneficiaryName(): string {
    if (!this.delivery || !this.delivery.beneficiary) return 'Unknown';
    return typeof this.delivery.beneficiary === 'object'
      ? this.delivery.beneficiary.name || 'Unknown'
      : 'Unknown';
  }
}