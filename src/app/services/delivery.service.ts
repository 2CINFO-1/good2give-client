import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  Delivery,
  DeliveryStatus,
  DeliveryRequest,
} from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private mockDeliveries: Delivery[] = [
    {
      _id: '1',
      donationId: 'd1',
      donation: {
        _id: 'd1',
        donorName: 'John Doe',
        items: [
          { name: 'Rice', quantity: 10, unit: 'kg' },
          { name: 'Beans', quantity: 5, unit: 'kg' },
        ],
      },
      status: DeliveryStatus.PENDING,
      scheduledDate: new Date('2023-06-15'),
      address: '123 Main St, Anytown, USA',
      recipientName: 'Community Center Alpha',
      recipientId: 'cc1',
      notes: 'Leave packages at the reception desk',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-01'),
    },
    {
      _id: '2',
      donationId: 'd2',
      donation: {
        _id: 'd2',
        donorName: 'Jane Smith',
        items: [
          { name: 'Pasta', quantity: 20, unit: 'boxes' },
          { name: 'Canned Tomatoes', quantity: 15, unit: 'cans' },
        ],
      },
      status: DeliveryStatus.IN_PROGRESS,
      scheduledDate: new Date('2023-06-10'),
      address: '456 Oak Ave, Somewhere, USA',
      recipientName: 'Food Bank Beta',
      recipientId: 'fb1',
      deliveryPersonName: 'Michael Johnson',
      deliveryPersonId: 'dp1',
      notes: 'Call recipient upon arrival',
      createdAt: new Date('2023-05-28'),
      updatedAt: new Date('2023-06-02'),
    },
    {
      _id: '3',
      donationId: 'd3',
      donation: {
        _id: 'd3',
        donorName: 'Company XYZ',
        items: [
          { name: 'Bottled Water', quantity: 50, unit: 'bottles' },
          { name: 'Canned Soup', quantity: 30, unit: 'cans' },
        ],
      },
      status: DeliveryStatus.COMPLETED,
      scheduledDate: new Date('2023-06-01'),
      completedDate: new Date('2023-06-01'),
      address: '789 Pine St, Elsewhere, USA',
      recipientName: 'Shelter Gamma',
      recipientId: 'sg1',
      deliveryPersonName: 'Sarah Williams',
      deliveryPersonId: 'dp2',
      notes: 'Delivered successfully',
      createdAt: new Date('2023-05-25'),
      updatedAt: new Date('2023-06-01'),
    },
  ];

  constructor() {}

  getDeliveries(): Observable<Delivery[]> {
    return of(this.mockDeliveries).pipe(
      delay(800), // Simulate network delay
      tap(() => console.log('Fetched deliveries'))
    );
  }

  getDeliveryById(id: string): Observable<Delivery> {
    const delivery = this.mockDeliveries.find((d) => d._id === id);
    if (delivery) {
      return of(delivery).pipe(
        delay(500),
        tap(() => console.log(`Fetched delivery id=${id}`))
      );
    }
    return throwError(() => new Error(`Delivery with id ${id} not found`));
  }

  createDelivery(deliveryRequest: DeliveryRequest): Observable<Delivery> {
    // Mock creating a new delivery
    const newId = (
      Math.max(...this.mockDeliveries.map((d) => Number(d._id))) + 1
    ).toString();

    const newDelivery: Delivery = {
      _id: newId,
      donationId: deliveryRequest.donationId,
      donation: {
        _id: deliveryRequest.donationId,
        donorName: 'New Donor', // Mock data
        items: [{ name: 'Sample Item', quantity: 1, unit: 'piece' }],
      },
      status: DeliveryStatus.PENDING,
      scheduledDate: deliveryRequest.scheduledDate,
      address: deliveryRequest.address,
      recipientName: 'Mock Recipient', // Mock data
      recipientId: deliveryRequest.recipientId,
      notes: deliveryRequest.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockDeliveries.push(newDelivery);

    return of(newDelivery).pipe(
      delay(800),
      tap(() => console.log(`Created delivery with id=${newId}`))
    );
  }

  updateDelivery(id: string, updates: Partial<Delivery>): Observable<Delivery> {
    const index = this.mockDeliveries.findIndex((d) => d._id === id);
    if (index === -1) {
      return throwError(() => new Error(`Delivery with id ${id} not found`));
    }

    const updatedDelivery = {
      ...this.mockDeliveries[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.mockDeliveries[index] = updatedDelivery;

    return of(updatedDelivery).pipe(
      delay(800),
      tap(() => console.log(`Updated delivery id=${id}`))
    );
  }

  deleteDelivery(id: string): Observable<void> {
    const index = this.mockDeliveries.findIndex((d) => d._id === id);
    if (index === -1) {
      return throwError(() => new Error(`Delivery with id ${id} not found`));
    }

    this.mockDeliveries.splice(index, 1);

    return of(undefined).pipe(
      delay(800),
      tap(() => console.log(`Deleted delivery id=${id}`))
    );
  }

  updateDeliveryStatus(
    id: string,
    status: DeliveryStatus
  ): Observable<Delivery> {
    const index = this.mockDeliveries.findIndex((d) => d._id === id);
    if (index === -1) {
      return throwError(() => new Error(`Delivery with id ${id} not found`));
    }

    const updates: Partial<Delivery> = { status };

    // If completing the delivery, add completion date
    if (status === DeliveryStatus.COMPLETED) {
      updates.completedDate = new Date();
    }

    const updatedDelivery = {
      ...this.mockDeliveries[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.mockDeliveries[index] = updatedDelivery;

    return of(updatedDelivery).pipe(
      delay(800),
      tap(() => console.log(`Updated delivery status id=${id} to ${status}`))
    );
  }
}
