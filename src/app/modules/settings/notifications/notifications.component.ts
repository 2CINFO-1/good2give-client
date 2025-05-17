import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { UserStateService } from '../../../core/services/user-state.service';

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  deliveryUpdates: boolean;
  newRequestNotifications: boolean;
  marketingEmails: boolean;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notificationForm: FormGroup;
  loading = false;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private userState: UserStateService
  ) {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      pushNotifications: [true],
      deliveryUpdates: [true],
      newRequestNotifications: [true],
      marketingEmails: [false],
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    // Note: This is a placeholder for future implementation
    // When the API supports notification preferences, replace this code

    this.loading = true;

    // Using setTimeout to simulate API call
    setTimeout(() => {
      // For now we just use default values
      const defaultPreferences: NotificationPreferences = {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        deliveryUpdates: true,
        newRequestNotifications: true,
        marketingEmails: false,
      };

      this.notificationForm.patchValue(defaultPreferences);
      this.loading = false;
    }, 500);

    /* 
    // This will be the actual implementation when API supports it
    this.userService.getNotificationPreferences()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (preferences) => {
          this.notificationForm.patchValue(preferences);
        },
        error: (error) => {
          this.errorMessage = 'Failed to load notification preferences.';
          this.toastr.error(this.errorMessage);
          console.error('Error loading notification preferences:', error);
        }
      });
    */
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      this.successMessage = null;

      // Note: This is a placeholder for future implementation
      // When the API supports notification preferences, replace this code

      // Using setTimeout to simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.successMessage = 'Notification preferences saved successfully!';
        this.toastr.success('Notification preferences saved successfully!');

        // Reset success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      }, 1000);

      /* 
      // This will be the actual implementation when API supports it
      const preferences = this.notificationForm.value;
      
      this.userService.updateNotificationPreferences(preferences)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Notification preferences saved successfully!';
            this.toastr.success('Notification preferences saved successfully!');
            
            // Reset success message after 3 seconds
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          },
          error: (error) => {
            this.errorMessage = 'Failed to save notification preferences.';
            this.toastr.error(this.errorMessage);
            console.error('Error saving notification preferences:', error);
          }
        });
      */
    }
  }
}
