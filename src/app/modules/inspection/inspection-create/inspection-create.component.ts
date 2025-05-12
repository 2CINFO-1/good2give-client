import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionReportService } from '../inspection-report.service';
import { InspectionReportFormBuilder } from '../inspection-report-form.builder';

@Component({
  selector: 'app-inspection-create',
  templateUrl: './inspection-create.component.html',
  styleUrls: ['./inspection-create.component.css'],
})
export class InspectionCreateComponent implements OnInit {
  form!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportService: InspectionReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = InspectionReportFormBuilder.buildForm(this.fb);
  }

  get issues(): FormArray {
    return this.form.get('issues') as FormArray;
  }

  addIssue(): void {
    this.issues.push(InspectionReportFormBuilder.buildIssueForm(this.fb));
  }

  removeIssue(index: number): void {
    this.issues.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fill out all required fields.';
      return;
    }

    // Transform form data to match backend expectations
    const formData = this.form.value;
    const inspectionData = {
      deliveryId: formData.deliveryId || null,
      depotId: formData.depotId || null,
      inspectionDate: formData.inspectionDate ? `${formData.inspectionDate}T00:00:00.000Z` : undefined,
      issues: formData.issues.map((issue: any) => ({
        type: issue.type,
        description: issue.description,
        severity: issue.severity,
        status: issue.status,
      })),
      status: formData.status,
      inspectorNotes: formData.inspectorNotes || undefined,
    };

    console.log('Submitting inspection data:', JSON.stringify(inspectionData, null, 2));

    this.reportService.create(inspectionData).subscribe({
      next: (response) => {
        console.log('Inspection created successfully:', response);
        this.form.reset();
        this.issues.clear();
        this.error = null;
        this.router.navigate(['/dashboard/inspection']);
      },
      error: (err) => {
        console.error('Failed to create inspection:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message,
        });
        this.error = err.error?.message || err.message || 'Failed to create inspection. Check console for details.';
      },
    });
  }
}
