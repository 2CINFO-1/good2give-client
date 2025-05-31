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
  templateUrl: './reclamation-res.component.html',
  styles: []
})
export class ReclamationResComponent implements OnInit {
  ReclamationStatus = ReclamationStatus;
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

  formatStatusLabel(status: ReclamationStatus): string {
    switch (status) {
      case ReclamationStatus.PENDING:
        return 'Pending';
      case ReclamationStatus.RESOLVED:
        return 'Resolved';
      case ReclamationStatus.CLOSED:
        return 'Closed';
      default:
        // Convert the status to string, capitalize first letter
        const statusStr = String(status);
        return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    }
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
