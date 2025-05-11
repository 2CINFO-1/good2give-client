import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Event,
  EventRequest,
  EventResponse,
  EventStatus,
} from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(eventData: EventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.apiUrl, eventData);
  }

  updateEvent(
    id: string,
    eventData: Partial<EventRequest>
  ): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to update event status
  updateEventStatus(id: string, status: EventStatus): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Additional methods for specific event operations
  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/my-events`);
  }

  // Get events by beneficiary
  getEventsByBeneficiary(beneficiaryId: string): Observable<Event[]> {
    return this.http.get<Event[]>(
      `${this.apiUrl}/beneficiary/${beneficiaryId}`
    );
  }

  // Filter events by date range
  getEventsByDateRange(
    startDate: string,
    endDate: string
  ): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/date-range`, {
      params: { startDate, endDate },
    });
  }
}
