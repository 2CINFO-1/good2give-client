import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';

@Component({
  selector: 'app-collectes-list',
  templateUrl: './collectes-list.component.html',
  styleUrls: ['./collectes-list.component.css'],
})
export class CollectesListComponent implements OnInit {
  collectes: any[] = [];
  filteredCollectes: any[] = [];
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
    @Inject('CollecteService') private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.loadCollectes();
  }

  loadCollectes(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.collectes = [
        {
          _id: 'coll1',
          status: CollecteStatus.PENDING,
          scheduledDate: new Date(),
          transporter: null,
        },
        {
          _id: 'coll2',
          status: CollecteStatus.ASSIGNED,
          scheduledDate: new Date(Date.now() + 86400000), // tomorrow
          transporter: { _id: 'trans1', name: 'John Doe' },
        },
        {
          _id: 'coll3',
          status: CollecteStatus.COMPLETED,
          scheduledDate: new Date(Date.now() - 86400000), // yesterday
          transporter: { _id: 'trans2', name: 'Jane Smith' },
        },
      ];
      this.applyFilters();
      this.isLoading = false;
    }, 800);
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
          (c.notes && c.notes.toLowerCase().includes(term))
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
      case CollecteStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case CollecteStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case CollecteStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case CollecteStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case CollecteStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatStatusLabel(status: string): string {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  viewDetails(collecte: any): void {
    this.router.navigate(['/dashboard/collectes', collecte._id]);
  }

  createCollecte(): void {
    this.router.navigate(['/dashboard/collectes/create']);
  }
}
