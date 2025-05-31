import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import {
  Reclamation,
  ReclamationRESRequest,
  ReclamationStatus,
} from '../../core/models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

interface SuggestionResponse {
  suggestion: string;
  confidence: number;
  reasoning: string;
}

@Component({
  selector: 'app-reclamation-res',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="reclamation-res-container">
      <div class="header">
        <h1>Resolve Reclamations</h1>
        <button
          class="btn btn-secondary"
          (click)="viewResolutions()"
          type="button"
        >
          <i class="material-icons">visibility</i>
          View All Resolutions
        </button>
      </div>

      <div class="filters">
        <input
          type="text"
          placeholder="Search reclamations..."
          class="search-input"
          [(ngModel)]="searchTerm"
          (keyup)="onSearch()"
        />
      </div>

      <div class="loading" *ngIf="loading">
        <p>Loading reclamations...</p>
      </div>

      <div
        class="no-data"
        *ngIf="!loading && filteredReclamations.length === 0"
      >
        <p>No reclamations found.</p>
      </div>

      <!-- Reclamations List -->
      <div
        class="reclamations-grid"
        *ngIf="
          !loading && filteredReclamations.length > 0 && !selectedReclamation
        "
      >
        <div
          class="reclamation-card"
          *ngFor="let reclamation of filteredReclamations"
          (click)="selectReclamation(reclamation)"
        >
          <div class="card-header">
            <h3>{{ reclamation.title }}</h3>
            <span class="status status-{{ reclamation.status }}">{{
              reclamation.status
            }}</span>
          </div>
          <div class="card-body">
            <p>
              <strong>Subject:</strong>
              {{ reclamation.subject | slice : 0 : 100
              }}{{ reclamation.subject.length > 100 ? '...' : '' }}
            </p>
            <p><strong>Date:</strong> {{ formatDate(reclamation.date) }}</p>
            <p>
              <strong>User:</strong>
              {{ getUserDisplayName(reclamation.userid) }}
            </p>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-sm btn-primary"
              (click)="selectReclamation(reclamation); $event.stopPropagation()"
              type="button"
            >
              Resolve
            </button>
          </div>
        </div>
      </div>

      <!-- Resolution Form -->
      <div class="resolution-form-container" *ngIf="selectedReclamation">
        <div class="resolution-header">
          <h2>Resolve Reclamation</h2>
          <button
            class="btn btn-secondary"
            (click)="closeResolutionForm()"
            type="button"
          >
            <i class="material-icons">close</i>
            Back to List
          </button>
        </div>

        <div class="reclamation-details">
          <h3>Reclamation Details</h3>
          <div class="detail-row">
            <label>Title:</label>
            <span>{{ selectedReclamation.title }}</span>
          </div>
          <div class="detail-row">
            <label>Subject:</label>
            <span>{{ selectedReclamation.subject }}</span>
          </div>
          <div class="detail-row">
            <label>Status:</label>
            <span class="status status-{{ selectedReclamation.status }}">{{
              selectedReclamation.status
            }}</span>
          </div>
          <div class="detail-row">
            <label>Date:</label>
            <span>{{ formatDate(selectedReclamation.date) }}</span>
          </div>
          <div class="detail-row">
            <label>User:</label>
            <span>{{ getUserDisplayName(selectedReclamation.userid) }}</span>
          </div>
        </div>

        <!-- AI Suggestion Section -->
        <div class="suggestion-section" *ngIf="suggestion">
          <h3>AI Suggested Resolution</h3>
          <div class="suggestion-card">
            <div class="suggestion-content">
              <p><strong>Suggestion:</strong> {{ suggestion.suggestion }}</p>
              <p>
                <strong>Confidence:</strong>
                {{ (suggestion.confidence * 100).toFixed(0) }}%
              </p>
              <p><strong>Reasoning:</strong> {{ suggestion.reasoning }}</p>
            </div>
            <button
              class="btn btn-sm btn-outline"
              (click)="useSuggestion()"
              type="button"
            >
              Use This Suggestion
            </button>
          </div>
        </div>

        <form
          [formGroup]="resolutionForm"
          (ngSubmit)="onSubmitResolution()"
          class="resolution-form"
        >
          <div class="form-actions-top">
            <button
              type="button"
              class="btn btn-info"
              (click)="getSuggestion()"
              [disabled]="loadingSuggestion"
              *ngIf="!suggestion"
            >
              <i class="material-icons">lightbulb</i>
              <span *ngIf="loadingSuggestion">Getting Suggestion...</span>
              <span *ngIf="!loadingSuggestion">Suggest Resolution</span>
            </button>
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

          <div class="form-group">
            <label for="picid">Person in Charge ID *</label>
            <input
              type="text"
              id="picid"
              formControlName="picid"
              class="form-control"
              placeholder="Enter person in charge ID"
              [class.is-invalid]="picid?.invalid && picid?.touched"
            />
            <div
              class="invalid-feedback"
              *ngIf="picid?.invalid && picid?.touched"
            >
              <div *ngIf="picid?.errors?.['required']">
                Person in charge ID is required
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeResolutionForm()"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-success"
              [disabled]="resolutionForm.invalid || isSubmitting"
            >
              <span *ngIf="isSubmitting">Creating Resolution...</span>
              <span *ngIf="!isSubmitting">Create Resolution</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .reclamation-res-container {
        padding: 2rem;
        max-width: 1200px;
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

      .filters {
        margin-bottom: 2rem;
      }

      .search-input {
        width: 100%;
        max-width: 400px;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .loading,
      .no-data {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .reclamations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .reclamation-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .reclamation-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f0f0f0;
      }

      .card-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }

      .status {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-pending {
        background-color: #fff3cd;
        color: #856404;
      }

      .status-resolved {
        background-color: #d1e7dd;
        color: #0f5132;
      }

      .status-closed {
        background-color: #f8d7da;
        color: #721c24;
      }

      .card-body p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .card-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
      }

      .resolution-form-container {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .resolution-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e9ecef;
      }

      .resolution-header h2 {
        margin: 0;
        color: #333;
      }

      .reclamation-details {
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .reclamation-details h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .detail-row {
        display: flex;
        margin-bottom: 0.5rem;
        align-items: flex-start;
      }

      .detail-row label {
        font-weight: 500;
        color: #333;
        width: 100px;
        flex-shrink: 0;
      }

      .detail-row span {
        color: #666;
        line-height: 1.4;
      }

      .suggestion-section {
        margin-bottom: 2rem;
      }

      .suggestion-section h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .suggestion-card {
        background: #e7f3ff;
        border: 1px solid #b3d9ff;
        border-radius: 6px;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
      }

      .suggestion-content {
        flex: 1;
      }

      .suggestion-content p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
      }

      .form-actions-top {
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: flex-end;
      }

      .resolution-form {
        border-top: 1px solid #e9ecef;
        padding-top: 1.5rem;
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
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
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

      .btn-success {
        background-color: #28a745;
        color: white;
      }

      .btn-success:hover:not(:disabled) {
        background-color: #218838;
      }

      .btn-info {
        background-color: #17a2b8;
        color: white;
      }

      .btn-info:hover:not(:disabled) {
        background-color: #138496;
      }

      .btn-outline {
        background-color: transparent;
        color: #007bff;
        border: 1px solid #007bff;
      }

      .btn-outline:hover {
        background-color: #007bff;
        color: white;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
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
export class ReclamationResComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  selectedReclamation: Reclamation | null = null;
  resolutionForm: FormGroup;
  suggestion: SuggestionResponse | null = null;
  loading = true;
  loadingSuggestion = false;
  isSubmitting = false;
  searchTerm = '';

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.resolutionForm = this.fb.group({
      resolnote: ['', [Validators.required, Validators.minLength(10)]],
      picid: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.loading = true;
    this.reclamationService.getAllReclamations().subscribe({
      next: (reclamations) => {
        this.reclamations = reclamations;
        this.filteredReclamations = reclamations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reclamations:', error);
        this.toastr.error('Failed to load reclamations');
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReclamations = this.reclamations;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredReclamations = this.reclamations.filter(
      (reclamation) =>
        reclamation.title.toLowerCase().includes(term) ||
        reclamation.subject.toLowerCase().includes(term) ||
        reclamation._id.toLowerCase().includes(term)
    );
  }

  selectReclamation(reclamation: Reclamation): void {
    this.selectedReclamation = reclamation;
    this.suggestion = null;
    this.resolutionForm.reset();
  }

  closeResolutionForm(): void {
    this.selectedReclamation = null;
    this.suggestion = null;
    this.resolutionForm.reset();
  }

  getSuggestion(): void {
    if (!this.selectedReclamation) return;

    this.loadingSuggestion = true;
    this.reclamationService
      .getSuggestions(this.selectedReclamation._id)
      .subscribe({
        next: (suggestion: SuggestionResponse) => {
          this.suggestion = suggestion;
          this.loadingSuggestion = false;
          this.toastr.success('AI suggestion generated successfully');
        },
        error: (error) => {
          console.error('Error getting suggestion:', error);
          this.toastr.error('Failed to get AI suggestion');
          this.loadingSuggestion = false;
        },
      });
  }

  useSuggestion(): void {
    if (this.suggestion) {
      this.resolutionForm.patchValue({
        resolnote: this.suggestion.suggestion,
      });
    }
  }

  onSubmitResolution(): void {
    if (this.resolutionForm.valid && this.selectedReclamation) {
      this.isSubmitting = true;
      const resolutionData: ReclamationRESRequest = {
        reclamid: this.selectedReclamation._id,
        resolnote: this.resolutionForm.value.resolnote,
        picid: this.resolutionForm.value.picid,
      };

      // First create the resolution
      this.reclamationService.createResolution(resolutionData).subscribe({
        next: (response) => {
          // Resolution created successfully, now update the reclamation status
          this.updateReclamationStatus(
            this.selectedReclamation!._id,
            ReclamationStatus.RESOLVED
          );
        },
        error: (error) => {
          console.error('Error creating resolution:', error);
          this.toastr.error('Failed to create resolution');
          this.isSubmitting = false;
        },
      });
    } else {
      this.markFormGroupTouched(this.resolutionForm);
    }
  }

  private updateReclamationStatus(
    reclamationId: string,
    status: ReclamationStatus
  ): void {
    this.reclamationService
      .updateReclamation(reclamationId, { status })
      .subscribe({
        next: (response) => {
          this.toastr.success(
            'Resolution created and reclamation status updated successfully'
          );
          this.isSubmitting = false;
          this.closeResolutionForm();
          this.loadReclamations(); // Refresh the list to show updated status
        },
        error: (error) => {
          console.error('Error updating reclamation status:', error);
          this.toastr.warning(
            'Resolution created but failed to update reclamation status'
          );
          this.isSubmitting = false;
          this.closeResolutionForm();
          this.loadReclamations(); // Still refresh the list
        },
      });
  }

  viewResolutions(): void {
    // Navigate to a separate page that shows all resolutions
    this.router.navigate(['/dashboard/reclamation-res/all-resolutions']);
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getUserDisplayName(userid: any): string {
    if (typeof userid === 'string') {
      return userid;
    } else if (userid && typeof userid === 'object') {
      // If userid is a populated user object
      return userid.email || userid.username || userid._id || 'Unknown User';
    }
    return 'Unknown User';
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
  get resolnote() {
    return this.resolutionForm.get('resolnote');
  }

  get picid() {
    return this.resolutionForm.get('picid');
  }
}
