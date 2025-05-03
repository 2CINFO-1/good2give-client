import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Donation {
  _id: string;
  donorName: string;
  pickupAddress: string;
  pickupDate: string;
  notes?: string;
  products: DonationProduct[];
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DonationProduct {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
}

export enum DonationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COLLECTED = 'COLLECTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export interface DonationRequest {
  donorName: string;
  pickupAddress: string;
  pickupDate: string;
  notes?: string;
  products: DonationProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private donations: Donation[] = [
    {
      _id: '1',
      donorName: 'John Doe',
      pickupAddress: '123 Main St, Anytown, AT 12345',
      pickupDate: '2023-09-15',
      notes: 'Please call before arriving',
      products: [
        {
          productId: 'prod1',
          name: 'Rice',
          quantity: 25,
          unit: 'kg',
        },
        {
          productId: 'prod3',
          name: 'Milk',
          quantity: 10,
          unit: 'liter',
        },
      ],
      status: DonationStatus.PENDING,
      createdAt: '2023-08-01T10:00:00Z',
      updatedAt: '2023-08-01T10:00:00Z',
    },
    {
      _id: '2',
      donorName: 'Jane Smith',
      pickupAddress: '456 Elm St, Othertown, OT 67890',
      pickupDate: '2023-09-20',
      products: [
        {
          productId: 'prod2',
          name: 'Beans',
          quantity: 15,
          unit: 'kg',
        },
      ],
      status: DonationStatus.APPROVED,
      createdAt: '2023-08-05T14:30:00Z',
      updatedAt: '2023-08-06T09:15:00Z',
    },
    {
      _id: '3',
      donorName: 'Community Center',
      pickupAddress: '789 Oak St, Somewhere, SW 13579',
      pickupDate: '2023-09-10',
      notes: 'Large donation, please bring a truck',
      products: [
        {
          productId: 'prod1',
          name: 'Rice',
          quantity: 100,
          unit: 'kg',
        },
        {
          productId: 'prod2',
          name: 'Beans',
          quantity: 50,
          unit: 'kg',
        },
        {
          productId: 'prod4',
          name: 'Flour',
          quantity: 30,
          unit: 'kg',
        },
      ],
      status: DonationStatus.COLLECTED,
      createdAt: '2023-08-02T11:15:00Z',
      updatedAt: '2023-09-10T16:30:00Z',
    },
  ];

  constructor() {}

  getDonations(): Observable<Donation[]> {
    return of(this.donations).pipe(delay(800)); // Simulate network delay
  }

  getDonationById(id: string): Observable<Donation> {
    const donation = this.donations.find((d) => d._id === id);
    if (donation) {
      return of(donation).pipe(delay(500));
    }
    return throwError(() => new Error('Donation not found'));
  }

  createDonation(donationData: DonationRequest): Observable<Donation> {
    const newDonation: Donation = {
      _id: (this.donations.length + 1).toString(),
      ...donationData,
      status: DonationStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.donations.push(newDonation);
    return of(newDonation).pipe(delay(800));
  }

  updateDonation(
    id: string,
    donationData: Partial<Donation>
  ): Observable<Donation> {
    const index = this.donations.findIndex((d) => d._id === id);
    if (index !== -1) {
      const updatedDonation = {
        ...this.donations[index],
        ...donationData,
        updatedAt: new Date().toISOString(),
      };
      this.donations[index] = updatedDonation;
      return of(updatedDonation).pipe(delay(800));
    }
    return throwError(() => new Error('Donation not found'));
  }

  deleteDonation(id: string): Observable<boolean> {
    const index = this.donations.findIndex((d) => d._id === id);
    if (index !== -1) {
      this.donations.splice(index, 1);
      return of(true).pipe(delay(800));
    }
    return throwError(() => new Error('Donation not found'));
  }

  updateDonationStatus(
    id: string,
    status: DonationStatus
  ): Observable<Donation> {
    const index = this.donations.findIndex((d) => d._id === id);
    if (index !== -1) {
      const updatedDonation = {
        ...this.donations[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      this.donations[index] = updatedDonation;
      return of(updatedDonation).pipe(delay(500));
    }
    return throwError(() => new Error('Donation not found'));
  }
}
