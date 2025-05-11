import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../core/services/collecte.service';

@Component({
  selector: 'app-collectes-list',
  templateUrl: './collectes-list.component.html',
  styleUrls: ['./collectes-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class CollectesListComponent implements OnInit {
  collectes: Collecte[] = [];
  filteredCollectes: Collecte[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm = '';
  statusFilter: string = '';
  CollecteStatus = CollecteStatus;

  constructor(
    private collecteService: CollecteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCollectes();
  }

  loadCollectes(): void {
    this.isLoading = true;
    this.error = null;

    this.collecteService
      .getAllCollectes()
      .pipe(
        catchError((error) => {
          this.error = 'Failed to load collections. Please try again.';
          console.error('Error loading collectes:', error);
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data) => {
        this.collectes = data;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    this.filteredCollectes = this.collectes.filter((collecte) => {
      // Status filter
      const statusMatch =
        !this.statusFilter ||
        collecte.status.toLowerCase() === this.statusFilter.toLowerCase();

      // Search term filter
      const searchMatch =
        !this.searchTerm ||
        collecte.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        collecte.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        collecte.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  viewCollecteDetails(id: string): void {
    this.router.navigate(['/dashboard/collectes', id]);
  }

  createCollecte(): void {
    this.router.navigate(['/dashboard/collectes/create']);
  }

  // Helper method to format dates consistently
  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
