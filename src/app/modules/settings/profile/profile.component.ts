import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import {
  User,
  UpdateUserProfileRequest,
} from '../../../core/models/user.model';
import { finalize } from 'rxjs/operators';
import { UserStateService } from '../../../core/services/user-state.service';

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
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private userState: UserStateService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.currentUser = this.userState.getCurrentUser();

    // If we already have the user in state, use it
    if (this.currentUser) {
      this.patchFormValues(this.currentUser);
    }

    // Also fetch the latest from the API
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.patchFormValues(user);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile. Please try again.';
        console.error('Error loading user profile:', error);
      },
    });
  }

  patchFormValues(user: User): void {
    this.profileForm.patchValue({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updateData: UpdateUserProfileRequest = {
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
        avatar: this.profileForm.value.avatar,
      };

      this.userService
        .updateUserProfile(updateData)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (updatedUser) => {
            this.successMessage = 'Profile updated successfully!';
            this.toastr.success('Profile updated successfully!');
            this.currentUser = updatedUser;

            // Update the user in global state
            this.userState.setCurrentUser(updatedUser);
          },
          error: (error) => {
            this.errorMessage = 'Failed to update profile. Please try again.';
            this.toastr.error('Failed to update profile');
            console.error('Error updating profile:', error);
          },
        });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
