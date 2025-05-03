import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Event, EventStatus, EventRequest } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: Event[] = [
    {
      _id: '1',
      title: 'Community Food Drive',
      description:
        'Join us for a community food drive to help local families in need.',
      date: '2023-09-15',
      time: '10:00-16:00',
      location: 'Community Center',
      organizer: 'Good2Give Foundation',
      attendees: 35,
      capacity: 50,
      status: EventStatus.UPCOMING,
      createdAt: '2023-08-01T10:00:00Z',
      updatedAt: '2023-08-01T10:00:00Z',
    },
    {
      _id: '2',
      title: 'Volunteer Training Workshop',
      description:
        'Training session for new volunteers to learn about our processes and guidelines.',
      date: '2023-09-20',
      time: '13:00-15:00',
      location: 'Good2Give Office',
      organizer: 'Volunteer Coordinator',
      attendees: 12,
      capacity: 20,
      status: EventStatus.UPCOMING,
      createdAt: '2023-08-05T14:30:00Z',
      updatedAt: '2023-08-05T14:30:00Z',
    },
    {
      _id: '3',
      title: 'Donation Distribution Day',
      description:
        'Distribution of collected donations to approved beneficiaries.',
      date: '2023-09-10',
      time: '09:00-17:00',
      location: 'Main Warehouse',
      organizer: 'Distribution Team',
      attendees: 25,
      capacity: 30,
      status: EventStatus.ONGOING,
      createdAt: '2023-08-02T11:15:00Z',
      updatedAt: '2023-09-05T09:30:00Z',
    },
  ];

  constructor() {}

  getEvents(): Observable<Event[]> {
    return of(this.events).pipe(delay(800)); // Simulate network delay
  }

  getEventById(id: string): Observable<Event> {
    const event = this.events.find((e) => e._id === id);
    if (event) {
      return of(event).pipe(delay(500));
    }
    return throwError(() => new Error('Event not found'));
  }

  createEvent(eventData: EventRequest): Observable<Event> {
    const newEvent: Event = {
      _id: (this.events.length + 1).toString(),
      ...eventData,
      status: EventStatus.UPCOMING,
      attendees: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.events.push(newEvent);
    return of(newEvent).pipe(delay(800));
  }

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    const index = this.events.findIndex((e) => e._id === id);
    if (index !== -1) {
      const updatedEvent = {
        ...this.events[index],
        ...eventData,
        updatedAt: new Date().toISOString(),
      };
      this.events[index] = updatedEvent;
      return of(updatedEvent).pipe(delay(800));
    }
    return throwError(() => new Error('Event not found'));
  }

  deleteEvent(id: string): Observable<boolean> {
    const index = this.events.findIndex((e) => e._id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      return of(true).pipe(delay(800));
    }
    return throwError(() => new Error('Event not found'));
  }

  updateEventStatus(id: string, status: EventStatus): Observable<Event> {
    const index = this.events.findIndex((e) => e._id === id);
    if (index !== -1) {
      const updatedEvent = {
        ...this.events[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      this.events[index] = updatedEvent;
      return of(updatedEvent).pipe(delay(500));
    }
    return throwError(() => new Error('Event not found'));
  }

  registerAttendee(id: string): Observable<Event> {
    const index = this.events.findIndex((e) => e._id === id);
    if (index !== -1) {
      const event = this.events[index];
      if (
        event.attendees !== undefined &&
        event.capacity !== undefined &&
        event.attendees < event.capacity
      ) {
        const updatedEvent = {
          ...event,
          attendees: event.attendees + 1,
          updatedAt: new Date().toISOString(),
        };
        this.events[index] = updatedEvent;
        return of(updatedEvent).pipe(delay(500));
      }
      return throwError(() => new Error('Event is at full capacity'));
    }
    return throwError(() => new Error('Event not found'));
  }

  removeAttendee(id: string): Observable<Event> {
    const index = this.events.findIndex((e) => e._id === id);
    if (index !== -1) {
      const event = this.events[index];
      if (event.attendees !== undefined && event.attendees > 0) {
        const updatedEvent = {
          ...event,
          attendees: event.attendees - 1,
          updatedAt: new Date().toISOString(),
        };
        this.events[index] = updatedEvent;
        return of(updatedEvent).pipe(delay(500));
      }
      return throwError(() => new Error('No attendees to remove'));
    }
    return throwError(() => new Error('Event not found'));
  }
}
