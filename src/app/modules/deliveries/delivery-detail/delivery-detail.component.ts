import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery, DeliveryStatus } from '../../../models/delivery.model';
import { DonationItem } from '../../../models/donation.model';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';
import { DonationService } from '../../../services/donation.service';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css'],
})
export class DeliveryDetailComponent implements OnInit {
  deliveryId: string | null = null;
  delivery: Delivery | null = null;
  donationItems: DonationItem[] = [];
  products: Product[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  DeliveryStatus = DeliveryStatus; // Expose enum to template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deliveryService: DeliveryService,
    private donationService: DonationService,
    private productService: ProductsService
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
    this.productService.getProducts().subscribe({
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
        this.loadDonationItems();
      },
      error: (err) => {
        this.error = true;
        this.errorMessage =
          err.message || 'Failed to load delivery details. Please try again.';
        this.loading = false;
      },
    });
  }

  loadDonationItems(): void {
    if (!this.delivery) return;

    const donationId =
      typeof this.delivery.donation === 'string'
        ? this.delivery.donation
        : (this.delivery.donation as any)._id;

    if (!donationId) {
      this.loading = false;
      return;
    }

    this.donationService.getDonationById(donationId).subscribe({
      next: (donation) => {
        this.donationItems = donation.items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading donation items:', err);
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

  getDonationId(): string {
    if (!this.delivery || !this.delivery.donation) {
      return 'N/A';
    }
    return typeof this.delivery.donation === 'string'
      ? this.delivery.donation
      : (this.delivery.donation as any)._id || 'N/A';
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

  updateStatus(newStatus: DeliveryStatus): void {
    if (!this.deliveryId) return;

    this.loading = true;
    this.deliveryService
      .updateDeliveryStatus(this.deliveryId, newStatus)
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
