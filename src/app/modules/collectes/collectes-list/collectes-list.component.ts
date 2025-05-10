import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';

@Component({
  selector: 'app-collectes-list',
  templateUrl: './collectes-list.component.html',
  styleUrls: ['./collectes-list.component.css'],
})
export class CollectesListComponent implements OnInit {
  collectes: Collecte[] = [];
  filteredCollectes: Collecte[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  statusFilter: CollecteStatus | 'ALL' = 'ALL';
  collecteStatus = CollecteStatus;
  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    ...Object.values(CollecteStatus).map((value) => ({
      value,
      label: this.formatStatusLabel(value),
    })),
  ];

  // Add the Math object to the component for use in template
  Math = Math;

  constructor(
    private router: Router,
    private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.loadCollectes();
  }

  loadCollectes(): void {
    this.isLoading = true;
    this.collecteService.getCollectes().subscribe({
      next: (data) => {
        this.collectes = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching collectes:', err);
        this.error = 'Failed to load collectes. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.collectes];

    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.status === this.statusFilter);
    }

    // Apply search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c._id.toLowerCase().includes(term) ||
          c.title.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term) ||
          c.location.toLowerCase().includes(term)
      );
    }

    this.filteredCollectes = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value as
      | CollecteStatus
      | 'ALL';
    this.applyFilters();
  }

  getStatusClass(status: CollecteStatus): string {
    switch (status) {
      case CollecteStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case CollecteStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case CollecteStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatStatusLabel(status: string): string {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  viewDetails(collecte: Collecte): void {
    this.router.navigate(['/dashboard/collectes', collecte._id]);
  }

  createCollecte(): void {
    this.router.navigate(['/dashboard/collectes/create']);
  }
}
