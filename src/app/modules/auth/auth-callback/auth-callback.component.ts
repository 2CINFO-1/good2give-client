import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OAuthService } from '../../../core/services/oauth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div
      class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div class="max-w-md w-full text-center">
        <div *ngIf="isLoading" class="p-8">
          <svg
            class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h2 class="text-xl font-semibold text-gray-700">
            Processing authentication...
          </h2>
        </div>
        <div *ngIf="errorMessage" class="p-8 bg-white rounded-2xl shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
          <a
            routerLink="/auth/login"
            class="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
          >
            Return to Login
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private oauthService: OAuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];
      const error = params['error'];

      if (error) {
        this.handleError('Authentication failed. Please try again.');
        return;
      }

      if (!accessToken || !refreshToken) {
        this.handleError('Invalid authentication response. Missing tokens.');
        return;
      }

      this.handleTokens(accessToken, refreshToken);
    });
  }

  private handleTokens(accessToken: string, refreshToken: string): void {
    try {
      // Store tokens
      const tokensStored = this.oauthService.storeOAuthTokens(
        accessToken,
        refreshToken
      );

      if (!tokensStored) {
        this.handleError(
          'Failed to store authentication tokens. Please try again.'
        );
        return;
      }

      // Update user state
      this.authService.loadCurrentUser();

      // Redirect to dashboard
      this.toastr.success('Login successful');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error handling tokens:', error);
      this.handleError(
        'Failed to process authentication tokens. Please try again.'
      );
    }
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    this.toastr.error(message);
  }
}
