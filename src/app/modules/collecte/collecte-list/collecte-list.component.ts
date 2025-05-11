import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../core/services/collecte.service';
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
      .getAllCollectes()
      .pipe(
        catchError((error) => {
          this.error = 'Failed to load collections. Please try again.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data) => {
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

  createCollecte(): void {
    this.router.navigate(['/dashboard/collecte/create']);
  }
}
