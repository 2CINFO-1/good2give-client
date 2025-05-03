import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.reclamationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      productId: ['', Validators.required],
      priority: ['medium', Validators.required],
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
    });
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
      this.router.navigate(['/reclamations']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/reclamations']);
  }
}
