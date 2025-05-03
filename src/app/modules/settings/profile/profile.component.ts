import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)],
      address: [''],
      city: [''],
      state: [''],
      zipCode: [''],
    });
  }

  ngOnInit(): void {
    // In a real app, load user profile data
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Simulate loading profile data
    setTimeout(() => {
      this.profileForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 555-123-4567',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      });
    }, 500);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.successMessage = 'Profile updated successfully!';
      }, 1000);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
