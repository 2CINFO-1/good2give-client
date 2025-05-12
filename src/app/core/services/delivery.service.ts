import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Delivery, DeliveryRequest, DeliveryResponse } from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`; // Align with backend

  constructor(private http: HttpClient) {}

  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<DeliveryResponse[]>(`${this.apiUrl}`).pipe(
      map((response) => response as Delivery[]),
      catchError((error) => {
        console.error('Error fetching deliveries', error);
        return throwError(() => error);
      })
    );
  }

  getDeliveryById(id: string): Observable<Delivery> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response as Delivery),
      catchError((error) => {
        console.error(`Error fetching delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  createDelivery(delivery: DeliveryRequest): Observable<Delivery> {
    return this.http.post<DeliveryResponse>(`${this.apiUrl}/create`, delivery).pipe(
      map((response) => response as Delivery),
      catchError((error) => {
        console.error('Error creating delivery', error);
        return throwError(() => error);
      })
    );
  }

  updateDelivery(id: string, delivery: Partial<Delivery>): Observable<Delivery> {
    return this.http.put<DeliveryResponse>(`${this.apiUrl}/${id}`, delivery).pipe(
      map((response) => response as Delivery),
      catchError((error) => {
        console.error(`Error updating delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  deleteDelivery(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  assignTransporter(id: string, transporterId: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}/assign`, { transporterId }).pipe(
      catchError((error) => {
        console.error(`Error assigning transporter to delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }
}