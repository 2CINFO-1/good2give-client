import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import {
  Reclamation,
  ReclamationRequest,
  ReclamationUpdateRequest,
} from '../../../core/models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reclamation-update',
  templateUrl: './reclamation-update.component.html',
  styleUrls: ['./reclamation-update.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ReclamationUpdateComponent implements OnInit {
  reclamationId!: string;
  reclamationForm!: FormGroup;
  reclamation: Reclamation | null = null;
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.reclamationId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    if (this.reclamationId) {
      this.loadReclamationData();
    } else {
      this.toastr.error('Invalid reclamation ID');
      this.router.navigate(['/dashboard/reclamations']);
    }
  }

  initForm(): void {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subject: ['', [Validators.required, Validators.minLength(10)]],
      userid: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  loadReclamationData(): void {
    this.isLoading = true;
    this.reclamationService.getReclamationById(this.reclamationId).subscribe({
      next: (reclamation: Reclamation) => {
        this.reclamation = reclamation;
        this.reclamationForm.patchValue({
          title: reclamation.title,
          subject: reclamation.subject,
          userid:
            typeof reclamation.userid === 'string'
              ? reclamation.userid
              : reclamation.userid._id,
          date: new Date(reclamation.date).toISOString().split('T')[0], // Format for input[type="date"]
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading reclamation:', error);
        this.toastr.error('Failed to load reclamation details');
        this.isLoading = false;
        this.router.navigate(['/dashboard/reclamations']);
      },
    });
  }

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      this.markFormGroupTouched(this.reclamationForm);
      return;
    }

    this.isSubmitting = true;
    const formValue = this.reclamationForm.value;

    const updateData: ReclamationUpdateRequest = {
      title: formValue.title,
      subject: formValue.subject,
      date: formValue.date,
    };

    this.reclamationService
      .updateReclamation(this.reclamationId, updateData)
      .subscribe({
        next: (response) => {
          this.toastr.success('Reclamation updated successfully');
          this.isSubmitting = false;
          this.router.navigate(['/dashboard/reclamations', this.reclamationId]);
        },
        error: (error: any) => {
          console.error('Error updating reclamation:', error);
          this.toastr.error('Failed to update reclamation');
          this.isSubmitting = false;
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/reclamations', this.reclamationId]);
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

  // Getter methods for form validation
  get title() {
    return this.reclamationForm.get('title');
  }

  get subject() {
    return this.reclamationForm.get('subject');
  }

  get userid() {
    return this.reclamationForm.get('userid');
  }

  get date() {
    return this.reclamationForm.get('date');
  }
}
