import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import {
  ReclamationRES,
  ReclamationRESRequest,
} from '../../../core/models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reclamation-res-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="update-resolution-container">
      <div class="header">
        <h1>Update Resolution</h1>
        <button class="btn btn-secondary" (click)="goBack()" type="button">
          <i class="material-icons">arrow_back</i>
          Back
        </button>
      </div>

      <div class="loading" *ngIf="loading">
        <p>Loading resolution...</p>
      </div>

      <form
        [formGroup]="resolutionForm"
        (ngSubmit)="onSubmit()"
        class="resolution-form"
        *ngIf="!loading"
      >
        <div class="form-group">
          <label for="reclamid">Reclamation ID *</label>
          <input
            type="text"
            id="reclamid"
            formControlName="reclamid"
            class="form-control"
            readonly
            [class.is-invalid]="reclamid?.invalid && reclamid?.touched"
          />
          <small class="form-text">Reclamation ID cannot be changed</small>
        </div>

        <div class="form-group">
          <label for="resolnote">Resolution Note *</label>
          <textarea
            id="resolnote"
            formControlName="resolnote"
            class="form-control"
            rows="5"
            placeholder="Enter detailed resolution note..."
            [class.is-invalid]="resolnote?.invalid && resolnote?.touched"
          >
          </textarea>
          <div
            class="invalid-feedback"
            *ngIf="resolnote?.invalid && resolnote?.touched"
          >
            <div *ngIf="resolnote?.errors?.['required']">
              Resolution note is required
            </div>
            <div *ngIf="resolnote?.errors?.['minlength']">
              Resolution note must be at least 10 characters long
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="resolutionForm.invalid || isSubmitting"
          >
            <span *ngIf="isSubmitting">Updating...</span>
            <span *ngIf="!isSubmitting">Update Resolution</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .update-resolution-container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header h1 {
        margin: 0;
        color: #333;
      }

      .loading {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .resolution-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      .form-control.is-invalid {
        border-color: #dc3545;
      }

      .form-control[readonly] {
        background-color: #f8f9fa;
        color: #6c757d;
      }

      .form-text {
        font-size: 0.875rem;
        color: #6c757d;
        margin-top: 0.25rem;
      }

      .invalid-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: #dc3545;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e9ecef;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #0056b3;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background-color: #5a6268;
      }

      .material-icons {
        font-size: 1.2rem;
      }

      textarea.form-control {
        resize: vertical;
        min-height: 120px;
      }
    `,
  ],
})
export class ReclamationResUpdateComponent implements OnInit {
  resolutionForm: FormGroup;
  resolution: ReclamationRES | null = null;
  loading = true;
  isSubmitting = false;
  resolutionId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService,
    private toastr: ToastrService
  ) {
    this.resolutionId = this.route.snapshot.paramMap.get('id') || '';
    this.resolutionForm = this.fb.group({
      reclamid: ['', [Validators.required]],
      resolnote: ['', [Validators.required, Validators.minLength(10)]],
      picid: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.resolutionId) {
      this.loadResolution();
    }
  }

  loadResolution(): void {
    this.loading = true;
    this.reclamationService.getResolutionById(this.resolutionId).subscribe({
      next: (resolution) => {
        this.resolution = resolution;
        this.resolutionForm.patchValue({
          reclamid: resolution.reclamid,
          resolnote: resolution.resolnote,
          picid: resolution.picid,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading resolution:', error);
        this.toastr.error('Failed to load resolution');
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.resolutionForm.valid && this.resolution) {
      this.isSubmitting = true;
      const updateData: Partial<ReclamationRESRequest> = {
        resolnote: this.resolutionForm.value.resolnote,
        picid: this.resolutionForm.value.picid,
      };

      this.reclamationService
        .updateResolution(this.resolution._id, updateData)
        .subscribe({
          next: (response) => {
            this.toastr.success('Resolution updated successfully');
            this.router.navigate([
              '/dashboard/reclamation-res',
              this.resolution!._id,
            ]);
          },
          error: (error) => {
            console.error('Error updating resolution:', error);
            this.toastr.error('Failed to update resolution');
            this.isSubmitting = false;
          },
        });
    } else {
      this.markFormGroupTouched(this.resolutionForm);
    }
  }

  goBack(): void {
    if (this.resolution) {
      this.router.navigate(['/dashboard/reclamation-res', this.resolution._id]);
    } else {
      this.router.navigate(['/dashboard/reclamation-res']);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for form controls
  get reclamid() {
    return this.resolutionForm.get('reclamid');
  }
  get resolnote() {
    return this.resolutionForm.get('resolnote');
  }
  get picid() {
    return this.resolutionForm.get('picid');
  }
}
