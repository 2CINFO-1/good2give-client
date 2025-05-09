import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionReportService } from '../inspection-report.service';
import { InspectionReport } from 'src/app/models/inspection.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  styleUrls: ['./inspection-list.component.css'],
})
export class InspectionListComponent implements OnInit {
  inspections: InspectionReport[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private inspectionService: InspectionReportService
  ) {}

  ngOnInit(): void {
    this.loadInspections();
  }

  // Load all inspection reports
  loadInspections(): void {
    this.loading = true;
    this.error = null;
    this.inspectionService
      .getAll()
      .pipe(
        tap((inspections) => {
          // Debug: Log raw API response
          console.log('Raw API response for inspections:', JSON.stringify(inspections, null, 2));
        }),
        catchError((err) => {
          this.error = 'Failed to load inspections. Please try again.';
          console.error('Error fetching inspections:', err);
          return of([]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((inspections) => {
        this.inspections = inspections.map((inspection) => ({
          ...inspection,
          inspectorId: inspection.inspectorId || { name: 'Unknown Inspector' },
        }));
      });
  }

  // Navigate to inspection detail view
  viewDetails(id: string): void {
    this.router.navigate(['/dashboard/inspection', id]);
  }

  // Navigate to create inspection form
  createInspection(): void {
    this.router.navigate(['/dashboard/inspection/create']);
  }

  // Return CSS class based on inspection status
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Format a date string into a readable format
  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '-';
  }
}
