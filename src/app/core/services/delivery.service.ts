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
    return this.http.get<DeliveryResponse[]>(`${this.apiUrl}?populate=transporter`).pipe(
      map((response) => response as Delivery[]),
      catchError((error) => {
        console.error('Error fetching deliveries', error);
        return throwError(() => error);
      })
    );
  }

  getDeliveryById(id: string): Observable<Delivery> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/${id}?populate=transporter`).pipe(
      map((response) => response as Delivery),
      catchError((error) => {
        console.error(`Error fetching delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  createDelivery(delivery: DeliveryRequest): Observable<Delivery> {
    console.log('Sending delivery request to:', `${this.apiUrl}`);
    console.log('Request payload:', JSON.stringify(delivery, null, 2));
    
    return this.http.post<DeliveryResponse>(`${this.apiUrl}`, delivery).pipe(
      map((response) => {
        console.log('Received response:', response);
        return response as Delivery;
      }),
      catchError((error) => {
        console.error('Error creating delivery:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);
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

  assignTransporter(id: string, transporterId: string): Observable<Delivery> {
    return this.updateDelivery(id, { transporter: transporterId });
  }
}