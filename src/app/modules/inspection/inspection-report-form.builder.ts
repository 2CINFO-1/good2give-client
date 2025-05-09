import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class InspectionReportFormBuilder {
  static buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      checklistId: ['', Validators.required],
      deliveryId: [''],
      depotId: [''],
      inspectionDate: ['', Validators.required],
      scheduledDate: [''],
      results: fb.array([]),
      issues: fb.array([]),
      status: ['pending', Validators.required],
      inspectorNotes: [''],
    });
  }
}
