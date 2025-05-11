import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import {
  Reclamation,
  ReclamationStatus,
} from '../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css'],
})
export class ReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter: string | ReclamationStatus = 'all';
  error: string | null = null;
  ReclamationStatus = ReclamationStatus;

  constructor(
    private reclamationsService: ReclamationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.isLoading = true;
    this.reclamationsService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.filteredReclamations = [...this.reclamations];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reclamations. Please try again.';
        this.isLoading = false;
        console.error('Error loading reclamations:', err);
      },
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string | ReclamationStatus): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReclamations = this.reclamations.filter((rec) => {
      // Apply search term filter
      const matchesSearch =
        this.searchTerm.trim() === '' ||
        rec._id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rec.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (rec.subject &&
          rec.subject.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Apply status filter
      const matchesStatus =
        this.statusFilter === 'all' || rec.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  formatStatusLabel(status: ReclamationStatus): string {
    switch (status) {
      case ReclamationStatus.PENDING:
        return 'Pending';
      case ReclamationStatus.RESOLVED:
        return 'Resolved';
      case ReclamationStatus.CLOSED:
        return 'Closed';
      default:
        // Convert status to string and capitalize first letter
        const statusString = String(status);
        return (
          statusString.charAt(0).toUpperCase() +
          statusString.slice(1).toLowerCase()
        );
    }
  }

  viewReclamation(id: string): void {
    this.router.navigate(['/dashboard/reclamations', id]);
  }

  createReclamation(): void {
    this.router.navigate(['/dashboard/reclamations/create']);
  }
}
