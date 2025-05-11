import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css'],
})
export class EventsListComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
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
      },
    });
  }

  goToEventDetail(id: string): void {
    this.router.navigate(['/dashboard/events', id]);
  }

  editEvent(id: string, event: Event): void {
    this.router.navigate(['/dashboard/events/edit', id]);
  }

  createEvent(): void {
    this.router.navigate(['/dashboard/events/create']);
  }

  deleteEvent(id: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter((event) => event._id !== id);
        },
        error: (err: any) => {
          this.error = 'Failed to delete event. Please try again later.';
          console.error('Error deleting event:', err);
        },
      });
    }
  }
}
