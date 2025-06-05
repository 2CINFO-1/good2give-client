import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';
  token = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    // Extract token from URL parameters
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage =
          'Invalid or missing reset token. Please request a new password reset link.';
      }
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  // Getter methods for form validation
  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || !this.token) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService
      .resetPassword(this.token, this.resetPasswordForm.value.password)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isSuccess = true;
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          this.isSubmitting = false;
        },
      });
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
