import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Delivery,
  DeliveryRequest,
  DeliveryResponse,
} from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  /**
   * Get all deliveries
   * @returns Observable of delivery array
   */
  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<DeliveryResponse[]>(this.apiUrl).pipe(
      map((response) => response as Delivery[]),
      catchError((error) => {
        console.error('Error fetching deliveries', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a delivery by ID
   * @param id Delivery ID
   * @returns Observable of a single delivery
   */
  getDeliveryById(id: string): Observable<Delivery> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response as Delivery),
      catchError((error) => {
        console.error(`Error fetching delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new delivery
   * @param delivery Delivery data
   * @returns Observable of created delivery
   */
  createDelivery(delivery: DeliveryRequest): Observable<Delivery> {
    return this.http.post<DeliveryResponse>(this.apiUrl, delivery).pipe(
      map((response) => response as Delivery),
      catchError((error) => {
        console.error('Error creating delivery', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing delivery
   * @param id Delivery ID
   * @param delivery Delivery data to update
   * @returns Observable of updated delivery
   */
  updateDelivery(
    id: string,
    delivery: Partial<DeliveryRequest>
  ): Observable<Delivery> {
    return this.http
      .put<DeliveryResponse>(`${this.apiUrl}/${id}`, delivery)
      .pipe(
        map((response) => response as Delivery),
        catchError((error) => {
          console.error(`Error updating delivery with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a delivery
   * @param id Delivery ID
   * @returns Observable of boolean indicating success
   */
  deleteDelivery(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting delivery with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Assign a transporter to a delivery
   * @param id Delivery ID
   * @param transporterId Transporter ID
   * @returns Observable of boolean indicating success
   */
  assignTransporter(id: string, transporterId: string): Observable<boolean> {
    return this.http
      .patch<boolean>(`${this.apiUrl}/${id}/assign`, { transporterId })
      .pipe(
        catchError((error) => {
          console.error(
            `Error assigning transporter to delivery with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }
}
