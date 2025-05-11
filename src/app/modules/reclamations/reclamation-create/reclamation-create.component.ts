import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import {
  ReclamationRequest,
  ReclamationStatus,
} from '../../../core/models/reclamation.model';
import { UserStateService } from '../../../core/services/user-state.service';

@Component({
  selector: 'app-reclamation-create',
  templateUrl: './reclamation-create.component.html',
  styleUrls: ['./reclamation-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ReclamationCreateComponent implements OnInit {
  reclamationForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  ReclamationStatus = ReclamationStatus;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reclamationService: ReclamationService,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subject: ['', [Validators.required, Validators.minLength(20)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      this.reclamationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const currentUser = this.userStateService.getCurrentUser();
    if (!currentUser || !currentUser._id) {
      this.error = 'User information not available';
      this.isSubmitting = false;
      return;
    }

    const reclamationData: ReclamationRequest = {
      userid: currentUser._id,
      title: this.reclamationForm.value.title,
      subject: this.reclamationForm.value.subject,
      date: this.reclamationForm.value.date,
    };

    this.reclamationService.createReclamation(reclamationData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard/reclamations']);
      },
      error: (err) => {
        this.error = 'Failed to create reclamation. Please try again.';
        this.isSubmitting = false;
        console.error('Error creating reclamation:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/reclamations']);
  }
}
