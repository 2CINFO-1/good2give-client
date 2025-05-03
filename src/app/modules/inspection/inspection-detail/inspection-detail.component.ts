import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionService } from '../../../services/inspection.service';
import {
  Inspection,
  InspectionStatus,
  InspectionFinding,
  FindingType,
  FindingSeverity,
} from '../../../models/inspection.model';

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

  // Make enums available in template
  InspectionStatus = InspectionStatus;
  FindingType = FindingType;
  FindingSeverity = FindingSeverity;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService
  ) {}

  ngOnInit(): void {
    this.inspectionId = this.route.snapshot.paramMap.get('id');

    if (this.inspectionId) {
      this.loadInspectionDetails(this.inspectionId);
    } else {
      this.error = 'No inspection ID provided';
    }
  }

  loadInspectionDetails(id: string): void {
    this.loading = true;
    this.error = null;

    this.inspectionService.getInspectionById(id).subscribe({
      next: (data) => {
        this.inspection = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load inspection details. Please try again.';
        this.loading = false;
        console.error('Error loading inspection:', err);
      },
    });
  }

  updateStatus(status: InspectionStatus): void {
    if (!this.inspectionId) return;

    this.loading = true;
    this.inspectionService
      .updateInspectionStatus(this.inspectionId, status)
      .subscribe({
        next: (data) => {
          this.inspection = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update inspection status. Please try again.';
          this.loading = false;
          console.error('Error updating status:', err);
        },
      });
  }

  resolveFinding(findingIndex: number): void {
    if (!this.inspectionId) return;

    this.loading = true;
    this.inspectionService
      .resolveInspectionFinding(this.inspectionId, findingIndex)
      .subscribe({
        next: (data) => {
          this.inspection = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to resolve finding. Please try again.';
          this.loading = false;
          console.error('Error resolving finding:', err);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/inspection']);
  }

  // Format date string to local date and time
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  getStatusClass(status: InspectionStatus): string {
    switch (status) {
      case InspectionStatus.PASSED:
        return 'bg-green-100 text-green-800';
      case InspectionStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case InspectionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case InspectionStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getSeverityClass(severity: FindingSeverity): string {
    switch (severity) {
      case FindingSeverity.LOW:
        return 'bg-green-100 text-green-800';
      case FindingSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case FindingSeverity.HIGH:
        return 'bg-orange-100 text-orange-800';
      case FindingSeverity.CRITICAL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeClass(type: FindingType): string {
    switch (type) {
      case FindingType.QUALITY:
        return 'bg-blue-100 text-blue-800';
      case FindingType.SAFETY:
        return 'bg-red-100 text-red-800';
      case FindingType.COMPLIANCE:
        return 'bg-purple-100 text-purple-800';
      case FindingType.OTHER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
