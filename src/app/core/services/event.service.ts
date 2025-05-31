import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventSerializer,
} from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * Get all events
   * @returns Array of event objects
   */
  getAllEvents(): Observable<EventSerializer[]> {
    return this.http.get<EventSerializer[]>(this.apiUrl);
  }

  /**
   * Get event by ID
   * @param id Event ID
   * @returns Event object
   */
  getEventById(id: string): Observable<EventSerializer> {
    return this.http.get<EventSerializer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new event
   * @param eventData Event creation data
   * @returns Newly created event
   */
  createEvent(eventData: CreateEventDto): Observable<EventSerializer> {
    return this.http.post<EventSerializer>(this.apiUrl, eventData);
  }

  /**
   * Update event by ID
   * @param id Event ID
   * @param updateData Data to update
   * @returns Updated event
   */
  updateEvent(
    id: string,
    updateData: UpdateEventDto
  ): Observable<EventSerializer> {
    return this.http.put<EventSerializer>(`${this.apiUrl}/${id}`, updateData);
  }

  /**
   * Delete event by ID
   * @param id Event ID
   * @returns Boolean indicating success
   */
  deleteEvent(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  /**
   * Suggest food for an event
   * @param eventId Event ID
   * @param numberOfAttendees Number of attendees
   * @param eventTitle Event title
   * @param eventObjective Event objective
   * @returns Array of food suggestions or null
   */
  suggestFood(
    eventId: string
  ): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiUrl}/${eventId}/suggest-food`);
  }
}
