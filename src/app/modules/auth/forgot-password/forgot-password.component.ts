import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  emailSent = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  // Getter methods for form validation
  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Simulate an API call with timeout
    setTimeout(() => {
      this.isSubmitting = false;
      this.emailSent = true;
      // Here you would normally handle the API response
    }, 1500);
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
