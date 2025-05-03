import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notificationsForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.notificationsForm = this.fb.group({
      emailNotifications: [true],
      donationUpdates: [true],
      newRequests: [true],
      deliveryUpdates: [true],
      systemAnnouncements: [true],
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
    if (this.notificationsForm.valid) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.successMessage = 'Notification preferences updated successfully!';
      }, 1000);
    }
  }
}
