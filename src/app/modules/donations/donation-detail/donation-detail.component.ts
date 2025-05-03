import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation, DonationStatus } from 'src/app/models/donation.model';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-donation-detail',
  templateUrl: './donation-detail.component.html',
  styleUrls: ['./donation-detail.component.css'],
})
export class DonationDetailComponent implements OnInit {
  donationId: string | null = null;
  donation: Donation | null = null;
  loading = true;
  error = false;
  errorMessage = '';
  DonationStatus = DonationStatus;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject('DonationService') private donationService: any,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.donationId = this.route.snapshot.paramMap.get('id');
    if (this.donationId) {
      this.loadProducts();
      this.loadDonation();
    } else {
      this.error = true;
      this.errorMessage = 'Donation ID not found';
      this.loading = false;
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error: any) => {
        console.error('Error loading products:', error);
      }
    );
  }

  loadDonation(): void {
    if (!this.donationId) return;

    // This would normally call the actual service
    this.donationService.getDonationById(this.donationId).subscribe(
      (data: Donation) => {
        this.donation = data;
        this.loading = false;
      },
      (error: any) => {
        this.error = true;
        this.errorMessage = 'Failed to load donation details';
        this.loading = false;
      }
    );
  }

  getProductName(productId: string): string {
    const product = this.products.find((p) => p._id === productId);
    return product?.name || '';
  }

  getProductType(productId: string): string {
    const product = this.products.find((p) => p._id === productId);
    return product?.productType || '';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/donations']);
  }

  updateStatus(status: DonationStatus): void {
    if (!this.donation || !this.donationId) return;

    this.loading = true;
    this.donationService
      .updateDonationStatus(this.donationId, status)
      .subscribe(
        (response: Donation) => {
          this.donation = response;
          this.loading = false;
        },
        (error: any) => {
          console.error('Error updating donation status:', error);
          this.error = true;
          this.errorMessage = 'Failed to update donation status';
          this.loading = false;
        }
      );
  }
}
