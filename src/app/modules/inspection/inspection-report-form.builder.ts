import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class InspectionReportFormBuilder {
  static buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      name: ['', Validators.required],
      note: [''],
      type: ['delivery', Validators.required],
      deliveryId: [''],
      depotId: [''],
      inspectionDate: ['', Validators.required],
      scheduledDate: [''],
      issues: fb.array([]),
      status: ['pending', Validators.required],
      inspectorNotes: [''],
    });
  }

  static buildIssueForm(fb: FormBuilder): FormGroup {
    return fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['low', Validators.required],
      status: ['failed', Validators.required],
    });
  }
}
