import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  eventForm: FormGroup;
  submitting = false;
  loading = true;
  error = '';
  eventId = '';
  eventData: Event | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      objective: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      numbre: [1, [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEvent(id);
      } else {
        this.error = 'Event ID not found';
        this.loading = false;
      }
    });
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (data: Event) => {
        this.eventData = data;
        this.patchFormValues(data);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load event details. Please try again later.';
        console.error('Error loading event:', err);
        this.loading = false;
      },
    });
  }

  patchFormValues(event: Event): void {
    // Create a local placeholder object for any missing fields
    const eventFormData = {
      title: event.title || '',
      objective: event.objective || '',
      date: event.date || '',
      numbre: event.numbre || 1,
      location: event.location || '',
    };

    this.eventForm.patchValue(eventFormData);
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

    this.eventService.updateEvent(this.eventId, eventData).subscribe({
      next: (event: Event) => {
        this.submitting = false;
        this.router.navigate(['/dashboard/events', this.eventId]);
      },
      error: (err: any) => {
        this.error = 'Failed to update event. Please try again later.';
        console.error('Error updating event:', err);
        this.submitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/events', this.eventId]);
  }

  // Convenience getter for form fields
  get f() {
    return this.eventForm.controls;
  }
}
