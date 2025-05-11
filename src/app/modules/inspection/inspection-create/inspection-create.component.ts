import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionService } from '../../../core/services/inspection.service';

@Component({
  selector: 'app-inspection-create',
  templateUrl: './inspection-create.component.html',
})
export class InspectionCreateComponent implements OnInit {
  inspectionForm: FormGroup;
  loading = false;
  submitting = false;
  stockId = '';
  error: string | null = null;

  // Define enums locally to avoid import issues
  FindingType = {
    DOCUMENTATION: 'DOCUMENTATION',
    PHYSICAL: 'PHYSICAL',
    PROCEDURE: 'PROCEDURE',
  };

  FindingSeverity = {
    CRITICAL: 'CRITICAL',
    MAJOR: 'MAJOR',
    MINOR: 'MINOR',
    OBSERVATION: 'OBSERVATION',
  };

  // Arrays for dropdown options in template
  findingTypes = [
    { value: 'DOCUMENTATION', label: 'Documentation' },
    { value: 'PHYSICAL', label: 'Physical' },
    { value: 'PROCEDURE', label: 'Procedure' },
  ];

  findingSeverities = [
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'MAJOR', label: 'Major' },
    { value: 'MINOR', label: 'Minor' },
    { value: 'OBSERVATION', label: 'Observation' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private inspectionService: InspectionService
  ) {
    this.inspectionForm = this.fb.group({
      inspectorId: ['', Validators.required],
      facilityId: ['', Validators.required],
      inspectionDate: ['', Validators.required],
      checklistId: ['', Validators.required],
      inspectorNotes: [''],
      results: this.fb.array([]),
      issues: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  // Convenience getters for form controls
  get resultsArray() {
    return this.inspectionForm.get('results') as FormArray;
  }

  get issuesArray() {
    return this.inspectionForm.get('issues') as FormArray;
  }

  // Create a new result form group
  createResultFormGroup(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      status: ['pass', Validators.required],
      comment: [''],
    });
  }

  // Add a new result to the form array
  addResult(): void {
    this.resultsArray.push(this.createResultFormGroup());
  }

  // Remove a result from the form array
  removeResult(index: number): void {
    this.resultsArray.removeAt(index);
  }

  // Add a new issue
  addIssue(): void {
    this.issuesArray.push(this.fb.control('', Validators.required));
  }

  // Remove an issue
  removeIssue(index: number): void {
    this.issuesArray.removeAt(index);
  }

  // Submit the form
  onSubmit(): void {
    if (this.inspectionForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.inspectionForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const inspectionData = this.inspectionForm.value;

    this.inspectionService.createInspection(inspectionData).subscribe(
      (response) => {
        this.submitting = false;
        this.router.navigate(['/inspections']);
      },
      (error) => {
        this.submitting = false;
        this.error =
          error.message ||
          'An error occurred while creating the inspection. Please try again.';
      }
    );
  }

  // Cancel and return to the list view
  cancel(): void {
    this.router.navigate(['/inspections']);
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (const ctrl of control.controls) {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          } else {
            ctrl.markAsTouched();
          }
        }
      }
    });
  }

  // Get form control validation status
  isInvalid(controlName: string): boolean {
    const control = this.inspectionForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  // Get form array control validation status
  isArrayControlInvalid(
    arrayName: string,
    index: number,
    controlName: string
  ): boolean {
    const array = this.inspectionForm.get(arrayName) as FormArray;
    if (!array) return false;

    const control = array.at(index)?.get(controlName);
    return !!control && control.invalid && control.touched;
  }
}
