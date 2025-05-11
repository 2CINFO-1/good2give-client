import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  CollecteStatus,
  CollecteRequest,
} from '../../../core/models/collecte.model';
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
    // No initialization required
  }

  get formControls() {
    return this.collecteForm.controls;
  }

  onSubmit(): void {
    if (this.collecteForm.invalid) {
      // Mark all fields as touched to trigger validation
      this.collecteForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;
    this.isLoading = true;

    // Only include properties that exist in the CollecteRequest model
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
        this.error = 'Failed to create collection. Please try again.';
        this.submitting = false;
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collectes']);
  }
}
