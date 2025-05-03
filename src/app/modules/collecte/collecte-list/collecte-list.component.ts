import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Donation } from '../../../core/models/donation.model';

@Component({
  selector: 'app-collecte-list',
  templateUrl: './collecte-list.component.html',
  styleUrls: ['./collecte-list.component.css'],
})
export class CollecteListComponent implements OnInit {
  collectes: Collecte[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // For template access
  CollecteStatus = CollecteStatus;
  Math = Math;

  constructor(
    private router: Router,
    @Inject('CollecteService') private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.loadCollectes();
  }

  loadCollectes(): void {
    this.loading = true;
    this.error = null;

    this.collecteService
      .getCollectes()
      .pipe(
        catchError((error) => {
          this.error = 'Failed to load collections. Please try again later.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data: Collecte[]) => {
        this.collectes = data;
        this.totalItems = data.length;
      });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > Math.ceil(this.totalItems / this.pageSize)) {
      return;
    }

    this.currentPage = page;
  }

  viewCollecteDetails(id: string): void {
    this.router.navigate(['/dashboard/collecte', id]);
  }

  assignTransporter(collecteId: string): void {
    this.loading = true;
    // In a real application, you would likely show a modal to select a transporter
    // For now, we'll just simulate assigning a transporter with a hardcoded ID
    const transporterId = 'transporter-123';

    this.collecteService
      .assignTransporter(collecteId, transporterId)
      .pipe(
        catchError((error) => {
          this.error = 'Failed to assign transporter. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result: Collecte | null) => {
        if (result) {
          // Refresh the list to show updated status
          this.loadCollectes();
        }
      });
  }

  getPagesArray(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  getDonationId(donation: string | Donation): string {
    if (typeof donation === 'string') {
      return donation;
    } else if (donation && typeof donation === 'object' && '_id' in donation) {
      return donation._id;
    }
    return 'N/A';
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
