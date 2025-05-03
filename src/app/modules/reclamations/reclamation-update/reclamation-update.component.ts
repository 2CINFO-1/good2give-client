import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reclamationId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadReclamationData();
  }

  initForm(): void {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      productId: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
    });
  }

  loadReclamationData(): void {
    // Simulate API call with timeout
    setTimeout(() => {
      const reclamationData = {
        title: 'Defective Product',
        description:
          'I received a damaged product. The packaging was intact but the product inside was broken. I would like a replacement or refund.',
        productId: 'PROD-12345',
        status: 'in-progress',
        priority: 'high',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
      };

      this.reclamationForm.patchValue(reclamationData);
      this.isLoading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Form submitted:', this.reclamationForm.value);
      this.isSubmitting = false;
      this.router.navigate(['/reclamations', this.reclamationId]);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/reclamations', this.reclamationId]);
  }
}
