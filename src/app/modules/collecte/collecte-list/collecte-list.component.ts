import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
    private collecteService: CollecteService
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

  getPagesArray(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  assignTransporter(collecteId: string): void {
    // Navigate to assign transporter page or implement modal logic here
    this.router.navigate(['/dashboard/collecte/assign', collecteId]);
  }
}
