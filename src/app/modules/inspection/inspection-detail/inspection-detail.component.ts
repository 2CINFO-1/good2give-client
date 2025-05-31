import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InspectionReportService } from '../inspection-report.service';
import { InspectionReport, Checklist, Issue } from 'src/app/core/models/inspection.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.css']
})
export class InspectionDetailComponent implements OnInit {
  inspectionId: string = '';
  inspection!: InspectionReport;
  checklist!: Checklist;
  issueForm: FormGroup;
  loading = {
    inspection: false,
    checklist: false,
    saving: false
  };
  currentIssue: Issue | null = null;
  showIssueForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private inspectionService: InspectionReportService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.issueForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['medium', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inspectionId = id;
      this.loadInspection();
      this.loadChecklist();
    } else {
      this.snackBar.open('No inspection ID provided', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard/inspection']);
    }
  }

  loadInspection(): void {
    this.loading.inspection = true;
    this.inspectionService.getById(this.inspectionId).subscribe({
      next: (inspection) => {
        this.inspection = inspection;
        if (inspection.issue) {
          this.currentIssue = inspection.issue;
          this.issueForm.patchValue(inspection.issue);
        }
        this.loading.inspection = false;
      },
      error: (error) => {
        console.error('Error loading inspection:', error);
        this.loading.inspection = false;
        this.snackBar.open('Error loading inspection details', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard/inspection']);
      }
    });
  }

  loadChecklist(): void {
    this.loading.checklist = true;
    this.inspectionService.getChecklistByInspectionId(this.inspectionId).subscribe({
      next: (checklist) => {
        this.checklist = checklist;
        this.loading.checklist = false;
      },
      error: (error) => {
        console.error('Error loading checklist:', error);
        this.loading.checklist = false;
        this.snackBar.open('Error loading checklist', 'Close', { duration: 3000 });
      }
    });
  }

  addIssue(): void {
    if (!this.issueForm.valid) return;

    // Store the issue locally without sending to backend
    this.currentIssue = {
      ...this.issueForm.value,
      status: 'failed',
      createdAt: new Date().toISOString()
    };

    this.issueForm.reset({ severity: 'medium' });
    this.showIssueForm = false;
    this.snackBar.open('Issue added', 'Close', { duration: 2000 });
  }

  updateStatus(status: 'approved' | 'rejected'): void {
    if (!this.checklist?.items.every(item => item.checked)) {
      this.snackBar.open('Please complete all checklist items before updating status', 'Close', { duration: 3000 });
      return;
    }

    this.loading.saving = true;

    let updateData: any;

    if (status === 'approved') {
      updateData = {
        status: 'approved',
        issue: null
      };
    } else {
      // For rejection, ensure there is an issue
      if (!this.currentIssue) {
        this.snackBar.open('Please add an issue before rejecting the inspection', 'Close', { duration: 3000 });
        this.loading.saving = false;
        return;
      }

      updateData = {
        issue: {
          type: this.currentIssue.type,
          description: this.currentIssue.description,
          severity: this.currentIssue.severity,
          status: 'failed'
        }
      };
    }

    this.inspectionService.update(this.inspectionId, updateData).subscribe({
      next: (inspection) => {
        this.inspection = inspection;
        this.loading.saving = false;
        this.snackBar.open(`Inspection ${status}`, 'Close', { duration: 2000 });
        this.router.navigate(['/dashboard/inspection']);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.loading.saving = false;
        this.snackBar.open(error.error?.message || 'Error updating status', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToChecklist(): void {
    this.router.navigate(['/dashboard/inspection', this.inspectionId, 'checklist']);
  }

  getChecklistProgress(): number {
    if (!this.checklist?.items?.length) return 0;
    const checkedItems = this.checklist.items.filter(item => item.checked).length;
    return Math.round((checkedItems / this.checklist.items.length) * 100);
  }

  isChecklistComplete(): boolean {
    return this.checklist?.items?.every(item => item.checked) || false;
  }

  goBack(): void {
    this.location.back();
  }

  // Helper methods for template
  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return '';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return '';
    }
  }

  canApprove(): boolean {
    return this.inspection?.status === 'pending' && !this.currentIssue;
  }

  canReject(): boolean {
    return this.inspection?.status === 'pending' && !!this.currentIssue;
  }

  editIssue(): void {
    if (this.currentIssue) {
      this.issueForm.patchValue({
        type: this.currentIssue.type,
        description: this.currentIssue.description,
        severity: this.currentIssue.severity
      });
      this.currentIssue = null;
      this.showIssueForm = true;
    }
  }

  removeIssue(): void {
    this.currentIssue = null;
    this.issueForm.reset({ severity: 'medium' });
    this.showIssueForm = false;
  }
}
