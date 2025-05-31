import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CollecteStatus, CollecteRequest } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../core/services/collecte.service';

@Component({
  selector: 'app-collecte-create',
  templateUrl: './collecte-create.component.html',
  styleUrls: ['./collecte-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CollecteCreateComponent implements OnInit {
  collecteForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private collecteService: CollecteService
  ) {
    this.collecteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.collecteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  get formControls() {
    return this.collecteForm.controls;
  }

  onSubmit(): void {
    if (this.collecteForm.invalid) {
      this.collecteForm.markAllAsTouched();
      this.error = 'Please fill out all required fields.';
      return;
    }

    this.submitting = true;
    this.isLoading = true;
    this.error = null;

    const collecteData: CollecteRequest = {
      title: this.collecteForm.get('title')?.value,
      description: this.collecteForm.get('description')?.value,
      location: this.collecteForm.get('location')?.value,
      status: CollecteStatus.PENDING,
    };

    this.collecteService.createCollecte(collecteData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/collectes']);
      },
      error: (err) => {
        this.error = err.status === 400
          ? 'Invalid data provided. Please check your inputs.'
          : 'Failed to create collection. Please try again later.';
        this.submitting = false;
        this.isLoading = false;
        console.error('Error creating collecte:', err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collectes']);
  }
  getCompletedFields(): number {
    let completed = 0;
    if (this.collecteForm.get('title')?.value) completed++;
    if (this.collecteForm.get('description')?.value) completed++;
    if (this.collecteForm.get('location')?.value) completed++;
    return completed;
  }
}
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatService {
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}

