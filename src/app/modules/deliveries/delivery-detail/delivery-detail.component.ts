import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { Delivery, DeliveryStatus } from '../../../core/models/delivery.model';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css'],
})
export class DeliveryDetailComponent implements OnInit {
  deliveryId: string | null = null;
  delivery: Delivery | null = null;
  products: Product[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  DeliveryStatus = DeliveryStatus;

  // Create a variable to match the enum values used in the template
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
    private productService: ProductService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('id');
    if (this.deliveryId) {
      this.loadProducts();
      this.loadDelivery();
    } else {
      this.error = true;
      this.errorMessage = 'Delivery ID is missing';
      this.loading = false;
    }
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
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

  getProductName(productId: string): string {
    const product = this.products.find((p) => p._id === productId);
    return product?.name || '';
  }

  getProductType(productId: string): string {
    const product = this.products.find((p) => p._id === productId);
    return product?.productType || '';
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

  // Getter methods to safely access properties that don't exist in the model
  // These methods will be used in the template
  getDeliveryPersonName(): string {
    if (!this.delivery) return 'Not assigned';
    return typeof this.delivery.transporter === 'object'
      ? this.delivery.transporter.name || 'Unknown'
      : 'Unknown';
  }

  getDeliveryPersonId(): string {
    if (!this.delivery?.transporter) return 'N/A';
    return this.delivery.transporter.toString();
  }

  getScheduledDate(): Date {
    if (!this.delivery?.pickupDate) return new Date();
    return new Date(this.delivery.pickupDate);
  }

  getAddress(): string {
    return 'Address not available in data model';
  }

  getNotes(): string {
    return 'Notes not available in data model';
  }

  getItems(): Array<{ name: string; quantity: number; unit: string }> {
    return [{ name: 'Mock Food Item', quantity: 1, unit: 'package' }];
  }
}
