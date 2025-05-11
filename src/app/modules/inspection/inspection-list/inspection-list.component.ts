import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from '../../../core/services/inspection.service';
import { Inspection } from '../../../core/models/inspection.model';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.css'],
})
export class InspectionListComponent implements OnInit {
  inspections: Inspection[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private inspectionService: InspectionService
  ) {}

  ngOnInit(): void {
    this.loadInspections();
  }

  loadInspections(): void {
    this.loading = true;
    this.error = null;

    this.inspectionService.getInspections().subscribe({
      next: (data: Inspection[]) => {
        this.inspections = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load inspections';
        this.loading = false;
        console.error('Error loading inspections:', err);
      },
    });
  }

  viewInspection(id: string): void {
    this.router.navigate(['/dashboard/inspection', id]);
  }

  createInspection(): void {
    this.router.navigate(['/dashboard/inspection/create']);
  }

  // Format date string to local date and time
  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  // Get appropriate CSS class for status badges
  getStatusClass(status: string): string {
    switch (status) {
      case 'PASSED':
        return 'badge-success';
      case 'FAILED':
        return 'badge-danger';
      case 'PENDING':
        return 'badge-warning';
      case 'COMPLETED':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  // Check if results array exists
  hasResults(inspection: Inspection): boolean {
    return Array.isArray(inspection.results) && inspection.results.length > 0;
  }

  // Count failed results
  countFailedResults(inspection: Inspection): number {
    if (!inspection.results) return 0;
    return inspection.results.filter((r) => r.status === 'fail').length;
  }

  // Check if issues array exists
  hasIssues(inspection: Inspection): boolean {
    return Array.isArray(inspection.issues) && inspection.issues.length > 0;
  }

  // Get issues count
  getIssuesCount(inspection: Inspection): number {
    if (!inspection.issues) return 0;
    return inspection.issues.length;
  }

  // Add this method to get the results count
  getResultsCount(inspection: Inspection): number {
    return inspection.results?.length || 0;
  }
}
