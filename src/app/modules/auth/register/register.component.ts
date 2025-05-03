import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterRequest, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        role: [UserRole.DONATOR, [Validators.required]], // Default role is donator
        agreedToTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  // Getter methods for form validation
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const userData: RegisterRequest = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.toastr.success('Registration successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';
        this.toastr.error(this.errorMessage);
      },
    });
  }
}
