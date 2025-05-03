import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation, DonationStatus } from 'src/app/models/donation.model';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject('DonationService') private donationService: any
  ) {}

  ngOnInit(): void {
    this.donationId = this.route.snapshot.paramMap.get('id');
    if (this.donationId) {
      this.loadDonation();
    } else {
      this.error = true;
      this.errorMessage = 'Donation ID not found';
      this.loading = false;
    }
  }

  loadDonation(): void {
    if (!this.donationId) return;

    // This would normally call the actual service
    // For now we're using a timeout to simulate API call
    setTimeout(() => {
      this.donation = {
        _id: this.donationId!,
        donorId: 'donor123',
        donorName: 'John Doe',
        items: [
          { productId: 'prod1', name: 'Rice', quantity: 50, unit: 'kg' },
          { productId: 'prod2', name: 'Beans', quantity: 30, unit: 'kg' },
        ],
        status: DonationStatus.APPROVED,
        pickupAddress: '123 Main St, Anytown, CA',
        pickupDate: new Date(),
        notes: 'Please handle with care',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.loading = false;
    }, 1000);
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
    if (!this.donation) return;

    // This would normally call the actual service
    // For now we're just updating the local state
    this.loading = true;
    setTimeout(() => {
      if (this.donation) {
        this.donation.status = status;
        this.donation.updatedAt = new Date();
      }
      this.loading = false;
    }, 1000);
  }
}
