import { Component, OnInit } from '@angular/core';
import { InspectionReportService } from '../inspection-report.service';
import { InspectionReport } from 'src/app/core/models/inspection.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inspection-dashboard',
  templateUrl: './inspection-dashboard.component.html',
  styleUrls: ['./inspection-dashboard.component.css']
})
export class InspectionDashboardComponent implements OnInit {
  unassignedReports: InspectionReport[] = [];
  myInspections: InspectionReport[] = [];
  myHistory: InspectionReport[] = [];
  loading = {
    unassigned: false,
    current: false,
    history: false
  };

  constructor(
    private inspectionService: InspectionReportService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUnassignedReports();
    this.loadMyInspections();
    this.loadMyHistory();
  }

  loadUnassignedReports(): void {
    this.loading.unassigned = true;
    this.inspectionService.getUnassignedReports().subscribe({
      next: (reports) => {
        this.unassignedReports = reports;
        this.loading.unassigned = false;
      },
      error: (error) => {
        console.error('Error loading unassigned reports:', error);
        this.loading.unassigned = false;
        this.snackBar.open('Error loading unassigned reports', 'Close', { duration: 3000 });
      }
    });
  }

  loadMyInspections(): void {
    this.loading.current = true;
    this.inspectionService.getMyInspections().subscribe({
      next: (inspections) => {
        this.myInspections = inspections;
        this.loading.current = false;
      },
      error: (error) => {
        console.error('Error loading my inspections:', error);
        this.loading.current = false;
        this.snackBar.open('Error loading my inspections', 'Close', { duration: 3000 });
      }
    });
  }

  loadMyHistory(): void {
    this.loading.history = true;
    this.inspectionService.getMyHistory().subscribe({
      next: (history: InspectionReport[]) => {
        this.myHistory = history;
        this.loading.history = false;
      },
      error: (error: any) => {
        console.error('Error loading inspection history:', error);
        this.loading.history = false;
        this.snackBar.open('Error loading inspection history', 'Close', { duration: 3000 });
      }
    });
  }

  assignToMe(reportId: string): void {
    if (!reportId) {
      this.snackBar.open('Invalid report ID', 'Close', { duration: 3000 });
      return;
    }
    this.inspectionService.assignToMe(reportId).subscribe({
      next: () => {
        this.loadUnassignedReports();
        this.loadMyInspections();
        this.snackBar.open('Inspection assigned successfully', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error assigning inspection:', error);
        this.snackBar.open('Error assigning inspection', 'Close', { duration: 3000 });
      }
    });
  }

  viewInspection(reportId: string): void {
    if (!reportId) {
      this.snackBar.open('Invalid report ID', 'Close', { duration: 3000 });
      return;
    }
    this.router.navigate(['/dashboard/inspection', reportId]);
  }

  // Helper method to safely get ID
  getReportId(report: InspectionReport): string {
    return report._id;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 