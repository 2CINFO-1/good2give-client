import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from '../../../services/inspection.service';
import { Inspection, InspectionStatus } from '../../../models/inspection.model';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.css'],
})
export class InspectionListComponent implements OnInit {
  inspections: Inspection[] = [];
  loading = false;
  error: string | null = null;
  InspectionStatus = InspectionStatus; // Make enum available in template

  constructor(
    private inspectionService: InspectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInspections();
  }

  loadInspections(): void {
    this.loading = true;
    this.error = null;

    this.inspectionService.getInspections().subscribe({
      next: (data) => {
        this.inspections = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load inspections. Please try again.';
        this.loading = false;
        console.error('Error loading inspections:', err);
      },
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/dashboard/inspection', id]);
  }

  createInspection(): void {
    this.router.navigate(['/dashboard/inspection/create']);
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

  // Format date string to local date
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
