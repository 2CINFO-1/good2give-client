import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
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
        this.event = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load event details. Please try again later.';
        console.error('Error loading event:', err);
        this.loading = false;
      },
    });
  }

  goToEditEvent(): void {
    if (this.event) {
      this.router.navigate(['/dashboard/events/edit', this.event._id]);
    }
  }

  goBackToList(): void {
    this.router.navigate(['/dashboard/events']);
  }

  deleteEvent(): void {
    if (this.event && confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.event._id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/events']);
        },
        error: (err: any) => {
          this.error = 'Failed to delete event. Please try again later.';
          console.error('Error deleting event:', err);
        },
      });
    }
  }

  formatDate(dateString: string | Date): string {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString();
  }
}
