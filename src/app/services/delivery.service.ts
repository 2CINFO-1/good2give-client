import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Delivery,
  DeliveryRequest,
  DeliveryResponse,
  DeliveryStatus,
} from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  getDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.apiUrl);
  }

  getDeliveryById(id: string): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.apiUrl}/${id}`);
  }

  createDelivery(deliveryData: DeliveryRequest): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(this.apiUrl, deliveryData);
  }

  updateDelivery(
    id: string,
    deliveryData: Partial<DeliveryRequest>
  ): Observable<DeliveryResponse> {
    return this.http.put<DeliveryResponse>(
      `${this.apiUrl}/${id}`,
      deliveryData
    );
  }

  deleteDelivery(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Status-specific delivery queries
  getDeliveriesByStatus(status: DeliveryStatus): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}?status=${status}`);
  }

  // Get deliveries by delivery person
  getDeliveriesByDeliveryPerson(
    deliveryPersonId: string
  ): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(
      `${this.apiUrl}?deliveryPersonId=${deliveryPersonId}`
    );
  }

  // Update delivery status
  updateDeliveryStatus(
    id: string,
    status: DeliveryStatus
  ): Observable<DeliveryResponse> {
    return this.http.patch<DeliveryResponse>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  // Assign delivery person
  assignDeliveryPerson(
    id: string,
    deliveryPersonId: string
  ): Observable<DeliveryResponse> {
    return this.http.patch<DeliveryResponse>(`${this.apiUrl}/${id}/assign`, {
      deliveryPersonId,
    });
  }
}
