import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionService } from '../../../core/services/inspection.service';
import {
  Inspection,
  InspectionStatus,
} from '../../../core/models/inspection.model';

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.css'],
})
export class InspectionDetailComponent implements OnInit {
  inspectionId: string | null = null;
  inspection: Inspection | null = null;
  loading = false;
  error: string | null = null;

  // Define status values for UI
  StatusValues = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService
  ) {}

  ngOnInit(): void {
    this.inspectionId = this.route.snapshot.paramMap.get('id');
    if (this.inspectionId) {
      this.loadInspectionDetails();
    } else {
      this.error = 'No inspection ID provided';
      this.router.navigate(['/dashboard/inspection']);
    }
  }

  loadInspectionDetails(): void {
    if (!this.inspectionId) return;

    this.loading = true;
    this.error = null;

    this.inspectionService.getInspectionById(this.inspectionId).subscribe({
      next: (data: Inspection) => {
        this.inspection = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load inspection details';
        this.loading = false;
        console.error('Error loading inspection:', err);
      },
    });
  }

  // Match template method name
  updateStatus(status: string): void {
    if (!this.inspectionId || !this.inspection) return;

    this.loading = true;
    this.error = null;

    this.inspectionService
      .updateInspectionStatus(this.inspectionId, status as InspectionStatus)
      .subscribe({
        next: (data: Inspection) => {
          this.inspection = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to update inspection status';
          this.loading = false;
          console.error('Error updating status:', err);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/inspection']);
  }

  // Format date string to local date and time
  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  // Check if results array exists
  hasResults(): boolean {
    return (
      !!this.inspection &&
      Array.isArray(this.inspection.results) &&
      this.inspection.results.length > 0
    );
  }

  // Check if issues array exists
  hasIssues(): boolean {
    return (
      !!this.inspection &&
      Array.isArray(this.inspection.issues) &&
      this.inspection.issues.length > 0
    );
  }

  // Get appropriate CSS class for status badges
  getStatusClass(status: string): string {
    switch (status) {
      case this.StatusValues.APPROVED:
        return 'badge-success';
      case this.StatusValues.REJECTED:
        return 'badge-danger';
      case this.StatusValues.PENDING:
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  // Get appropriate CSS class for result status
  getResultStatusClass(status: string): string {
    switch (status) {
      case 'pass':
        return 'badge-success';
      case 'fail':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  // Mark a result as resolved (would need backend implementation)
  resolveIssue(index: number): void {
    if (!this.inspection || !this.inspection.issues) return;

    console.log(`Issue ${index} would be marked as resolved`);
    // In a real implementation, you would call the API
  }
}
