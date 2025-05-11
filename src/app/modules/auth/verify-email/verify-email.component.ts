import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EmailVerificationService } from '../../../core/services/email-verification.service';
import { UserStateService } from '../../../core/services/user-state.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  verificationForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  verificationSent = false;
  userEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    private userState: UserStateService
  ) {
    this.verificationForm = this.fb.group({
      code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  ngOnInit(): void {
    // First check for email in query params (if user was redirected here)
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.userEmail = params['email'];
      } else {
        this.checkUserState();
      }
    });
  }

  private checkUserState(): void {
    // Check if user is already verified
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      if (currentUser.isEmailVerified) {
        this.router.navigate(['/dashboard/home']);
        return;
      }

      // Get the user's email if available
      if (currentUser.email) {
        this.userEmail = currentUser.email;
        return;
      }
    }

    // If we don't have the email yet, subscribe to the userState to wait for it
    if (!this.userEmail) {
      this.userState.currentUser$.subscribe((user) => {
        if (user?.email) {
          this.userEmail = user.email;

          if (user.isEmailVerified) {
            this.router.navigate(['/dashboard/home']);
          }
        } else {
          // If still no email, the user might not be authenticated
          // Redirect to login with a message
          this.router.navigate(['/login'], {
            queryParams: {
              message: 'Please log in to verify your email',
            },
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.verificationForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const code = this.verificationForm.get('code')?.value;

    this.emailVerificationService.verifyEmail(code).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage =
          response.message || 'Email verified successfully!';

        // Update the current user's verification status
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          // Create a new user object with updated verification status
          const updatedUser = {
            ...currentUser,
            isEmailVerified: true,
          };

          // Update the user state directly
          this.userState.setCurrentUser(updatedUser);

          console.log(
            'VerifyEmailComponent - Updated user state with verified email',
            updatedUser
          );
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard/home']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message || 'Invalid or expired verification code';
      },
    });
  }

  resendCode(): void {
    if (!this.userEmail) {
      this.errorMessage = 'Email address not found. Please login again.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.emailVerificationService.requestVerificationEmail().subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.verificationSent = true;
        this.successMessage =
          response.message || 'Verification code sent successfully!';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ||
          'Failed to send verification code. Please try again.';
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to login even if there's an error
        this.router.navigate(['/login']);
      },
    });
  }
}
