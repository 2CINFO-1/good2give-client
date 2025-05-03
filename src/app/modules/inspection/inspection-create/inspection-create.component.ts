import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionService } from '../../../services/inspection.service';
import {
  Inspection,
  FindingType,
  FindingSeverity,
} from '../../../models/inspection.model';

@Component({
  selector: 'app-inspection-create',
  templateUrl: './inspection-create.component.html',
  styleUrls: ['./inspection-create.component.css'],
})
export class InspectionCreateComponent implements OnInit {
  inspectionForm: FormGroup;
  stockId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  // Make enums available in template
  findingTypes = Object.values(FindingType);
  findingSeverities = Object.values(FindingSeverity);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService
  ) {
    // Initialize the form
    this.inspectionForm = this.fb.group({
      inspector: ['', [Validators.required, Validators.minLength(3)]],
      notes: [''],
      findings: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.stockId = this.route.snapshot.paramMap.get('stockId');

    // If no stock ID provided, redirect to the inspection list
    if (!this.stockId) {
      this.router.navigate(['/dashboard/inspection']);
    }
  }

  // Getter for the findings FormArray
  get findings(): FormArray {
    return this.inspectionForm.get('findings') as FormArray;
  }

  // Add a new finding to the form
  addFinding(): void {
    const findingGroup = this.fb.group({
      type: [FindingType.QUALITY, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      severity: [FindingSeverity.LOW, Validators.required],
      actionRequired: [''],
    });

    this.findings.push(findingGroup);
  }

  // Remove a finding from the form
  removeFinding(index: number): void {
    this.findings.removeAt(index);
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid) {
      this.markFormGroupTouched(this.inspectionForm);
      return;
    }

    if (!this.stockId) {
      this.error = 'No stock ID provided';
      return;
    }

    this.submitting = true;

    const formData = this.inspectionForm.value;
    const inspectionData: Partial<Inspection> = {
      stockId: this.stockId,
      inspector: formData.inspector,
      notes: formData.notes,
      findings: formData.findings,
    };

    this.inspectionService.createInspection(inspectionData).subscribe({
      next: (inspection) => {
        this.router.navigate(['/dashboard/inspection', inspection._id]);
      },
      error: (err) => {
        this.error = 'Failed to create inspection. Please try again.';
        this.submitting = false;
        console.error('Error creating inspection:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/inspection']);
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
