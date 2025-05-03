import { Component, OnInit, Inject } from '@angular/core';
import { Donation, DonationStatus } from 'src/app/models/donation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-donations-list',
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.css'],
})
export class DonationsListComponent implements OnInit {
  donations: Donation[] = [];
  loading = true;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Filters
  statusFilter: DonationStatus | '' = '';
  searchTerm = '';

  // Make Math accessible to the template
  Math = Math;

  // Expose enum to template
  DonationStatus = DonationStatus;

  constructor(
    @Inject('DonationService') private donationService: any,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    if (this.statusFilter) {
      params.status = this.statusFilter;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.donationService.getDonations(params).subscribe({
      next: (data: any) => {
        this.donations = data.results;
        this.totalItems = data.total;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading donations. Please try again.';
        this.loading = false;
        console.error('Error loading donations:', err);
      },
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
    }
    this.loadDonations();
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page when filters change
    this.loadDonations();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.searchTerm = '';
    this.onFilterChange();
  }

  getPagesArray(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  cancelDonation(id: string): void {
    if (confirm('Are you sure you want to cancel this donation?')) {
      this.donationService.cancelDonation(id, 'Canceled by user').subscribe({
        next: () => {
          this.toastr.success('Donation canceled successfully');
          this.loadDonations();
        },
        error: (err: any) => {
          this.toastr.error('Error canceling donation');
          console.error('Error canceling donation:', err);
        },
      });
    }
  }

  // Add this method for template use
  getMaxPage(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
