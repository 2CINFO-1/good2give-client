import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionReportService } from '../inspection-report.service';
import { InspectionReport } from 'src/app/core/models/inspection.model';
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

  loadInspections(): void {
    this.loading = true;
    this.error = null;
    this.inspectionService
      .getAll()
      .pipe(
        tap((inspections) => {
          console.log('Raw API response for inspections:', JSON.stringify(inspections, null, 2));
        }),
        catchError((err) => {
          this.error = err.status === 401 ? 'Authentication failed. Please log in.' : 'Failed to load inspections. Please try again.';
          console.error('Error fetching inspections:', err);
          return of([]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((inspections) => {
        this.inspections = inspections;
        console.log('Inspections loaded:', JSON.stringify(this.inspections, null, 2));
      });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/dashboard/inspection', id]);
  }

  createInspection(): void {
    this.router.navigate(['/dashboard/inspection/create']);
  }

  deleteInspection(id: string): void {
    if (confirm('Are you sure you want to delete this inspection report?')) {
      this.inspectionService.delete(id).subscribe({
        next: () => {
          this.inspections = this.inspections.filter((inspection) => inspection._id !== id);
          this.error = null;
        },
        error: (err) => {
          this.error = 'Failed to delete inspection report.';
          console.error('Error deleting inspection:', err);
        },
      });
    }
  }

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

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '-';
  }
}
