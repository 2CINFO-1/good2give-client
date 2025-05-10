import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteStatus } from '../../../models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';

@Component({
  selector: 'app-collecte-create',
  templateUrl: './collecte-create.component.html',
  styleUrls: ['./collecte-create.component.css'],
})
export class CollecteCreateComponent implements OnInit {
  collecteForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  transporters: any[] = [];
  isLoadingTransporters = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject('CollecteService') private collecteService: CollecteService
  ) {
    this.collecteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      transporterId: [''],
      scheduledDate: ['', Validators.required],
      notes: [''],
      items: this.fb.array([]),
    });

    // Add at least one item by default
    this.addItem();
  }

  ngOnInit(): void {
    this.loadTransporters();
  }

  get formControls() {
    return this.collecteForm.controls;
  }

  get itemsFormArray(): FormArray {
    return this.collecteForm.get('items') as FormArray;
  }

  get itemsControls(): AbstractControl[] {
    return this.itemsFormArray.controls;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit: ['pcs'],
    });
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  loadTransporters(): void {
    this.isLoadingTransporters = true;

    // Simulate API call for transporters
    setTimeout(() => {
      this.transporters = [
        { _id: '1', name: 'John Doe' },
        { _id: '2', name: 'Jane Smith' },
      ];
      this.isLoadingTransporters = false;
    }, 800);
  }

  onSubmit(): void {
    if (this.collecteForm.invalid || this.itemsFormArray.length === 0) {
      // Mark all fields as touched to trigger validation
      this.collecteForm.markAllAsTouched();
      this.itemsFormArray.controls.forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = null;

    const collecteData = {
      title: this.collecteForm.get('title')?.value,
      description: this.collecteForm.get('description')?.value,
      location: this.collecteForm.get('location')?.value,
      items: this.itemsFormArray.value,
      status: CollecteStatus.PENDING,
    };

    this.collecteService.createCollecte(collecteData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/collectes']);
      },
      error: (err) => {
        this.error = 'Failed to create collection. Please try again.';
        this.submitting = false;
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collectes']);
  }
}
