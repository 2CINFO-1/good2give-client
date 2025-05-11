import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit {
  eventForm: FormGroup;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      objective: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      numbre: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Initialize with tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    this.eventForm.patchValue({
      date: formattedDate,
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.eventForm.controls).forEach((key) => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';

    const eventData = this.eventForm.value;

    this.eventService.createEvent(eventData).subscribe({
      next: (event: Event) => {
        this.submitting = false;
        this.router.navigate(['/dashboard/events']);
      },
      error: (err: any) => {
        this.error = 'Failed to create event. Please try again later.';
        console.error('Error creating event:', err);
        this.submitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/events']);
  }

  // Convenience getter for form fields
  get f() {
    return this.eventForm.controls;
  }
}
