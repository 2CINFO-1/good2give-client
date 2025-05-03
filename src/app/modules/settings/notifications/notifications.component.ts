import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notificationForm: FormGroup;
  loading = false;
  success = false;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
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
    // Load user notification preferences (mocked)
    this.loadPreferences();
  }

  loadPreferences(): void {
    // In a real app, fetch user preferences from API
    // Here we just use default values in the form constructor
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Notification preferences saved successfully!';

      // Reset success message after 3 seconds
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    }, 1000);
  }
}
