import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-landing-events',
  templateUrl: './landing-events.component.html',
})
export class LandingEventsComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  loadAllEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load events. Please try again later.';
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }
} 