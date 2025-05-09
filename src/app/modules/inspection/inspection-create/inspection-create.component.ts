import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionReportService } from '../inspection-report.service';
import { InspectionReportFormBuilder } from '../inspection-report-form.builder';

@Component({
  selector: 'app-inspection-create',
  templateUrl: './inspection-create.component.html',
  styleUrls: ['./inspection-create.component.css'],
})
export class InspectionCreateComponent implements OnInit {
  form!: FormGroup;
  checklistId!: string;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportService: InspectionReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checklistId = this.route.snapshot.paramMap.get('checklistId') || '';
    this.form = InspectionReportFormBuilder.buildForm(this.fb);
    if (this.checklistId) {
      this.form.patchValue({ checklistId: this.checklistId });
    }
  }

  get results(): FormArray {
    return this.form.get('results') as FormArray;
  }

  get issues(): FormArray {
    return this.form.get('issues') as FormArray;
  }

  addResult(): void {
    const resultGroup = this.fb.group({
      item: ['', Validators.required],
      status: ['pass', Validators.required],
      comment: [''],
    });
    this.results.push(resultGroup);
  }

  removeResult(index: number): void {
    this.results.removeAt(index);
  }

  addIssue(): void {
    this.issues.push(this.fb.control(''));
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
      checklistId: formData.checklistId,
      deliveryId: formData.deliveryId || null,
      depotId: formData.depotId || null,
      inspectionDate: formData.inspectionDate ? `${formData.inspectionDate}T00:00:00.000Z` : null,
      scheduledDate: formData.scheduledDate ? `${formData.scheduledDate}T00:00:00.000Z` : null,
      results: formData.results.map((result: any) => ({
        item: result.item,
        status: result.status,
        comment: result.comment || undefined,
      })),
      issues: formData.issues.filter((issue: string) => issue), // Remove empty strings
      status: formData.status,
      inspectorNotes: formData.inspectorNotes || undefined,
    };

    // Debug: Log the exact payload
    console.log('Submitting inspection data:', JSON.stringify(inspectionData, null, 2));

    this.reportService.create(inspectionData).subscribe({
      next: (response) => {
        console.log('Inspection created successfully:', response);
        this.form.reset();
        this.results.clear();
        this.issues.clear();
        this.error = null;
        this.router.navigate(['/dashboard/inspection']);
      },
      error: (err) => {
        // Debug: Log full error details
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
