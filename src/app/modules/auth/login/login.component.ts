import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OAuthService } from '../../../core/services/oauth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  returnUrl: string = '/dashboard/home';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private oauthService: OAuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/dashboard/home'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard/home';

    // Check if there's an error from the callback
    const error = this.route.snapshot.queryParams['error'];
    if (error) {
      this.errorMessage = 'Authentication failed. Please try again.';
      this.toastr.error(this.errorMessage);
    }

    // Check if there's a message from other components
    const message = this.route.snapshot.queryParams['message'];
    if (message) {
      this.toastr.info(message);
    }

    console.log('LoginComponent - Initialized with returnUrl:', this.returnUrl);
  }

  // Getter methods for form validation
  get f() {
    return this.loginForm.controls;
  }

  // Method to handle Google sign-in
  signInWithGoogle(): void {
    this.isSubmitting = true;
    this.errorMessage = '';

    console.log('Redirecting to Google authentication');

    // Redirect to the backend's Google auth endpoint
    window.location.href = this.oauthService.getGoogleAuthUrl();
  }

  onSubmit(): void {
    console.log('LoginComponent onSubmit - Starting login process');

    if (this.loginForm.invalid) {
      console.log(
        'LoginComponent onSubmit - Form is invalid',
        this.loginForm.errors
      );
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    console.log('LoginComponent onSubmit - Submitting credentials', {
      email: credentials.email,
      password: '***',
    });

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log(
          'LoginComponent onSubmit - Login success response:',
          response
        );

        // Check if authentication is working
        console.log(
          'LoginComponent onSubmit - Is authenticated:',
          this.authService.isAuthenticated()
        );
        console.log(
          'LoginComponent onSubmit - Current user:',
          this.authService.getCurrentUser()
        );

        this.isSubmitting = false;
        this.toastr.success('Login successful');

        // Check if email verification is required
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && !currentUser.isEmailVerified) {
          console.log(
            'LoginComponent onSubmit - Email not verified, redirecting to verification page'
          );
          this.toastr.warning('Please verify your email address to continue');
          // Forward the email to the verification page
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: currentUser.email },
          });
        } else {
          console.log(
            'LoginComponent onSubmit - Email verified, navigating to:',
            this.returnUrl
          );
          // Use navigateByUrl for absolute paths, navigate for relative paths
          if (this.returnUrl.startsWith('/')) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        }
      },
      error: (error) => {
        console.error('LoginComponent onSubmit - Login error:', error);

        this.isSubmitting = false;
        this.errorMessage =
          error.error?.message ||
          'Login failed. Please check your credentials.';
        this.toastr.error(this.errorMessage);
      },
    });
  }
}
