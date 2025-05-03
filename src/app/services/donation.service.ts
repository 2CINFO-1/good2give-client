import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import {
  Donation,
  DonationRequest,
  DonationStatus,
} from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiUrl = `${environment.apiUrl}/donations`;

  constructor(private http: HttpClient) {}

  getDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching donations:', error);
        return throwError(() => new Error('Failed to fetch donations'));
      })
    );
  }

  getDonationById(id: string): Observable<Donation> {
    return this.http.get<Donation>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching donation with ID ${id}:`, error);
        return throwError(() => new Error('Failed to fetch donation'));
      })
    );
  }

  createDonation(donationData: DonationRequest): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, donationData).pipe(
      catchError((error) => {
        console.error('Error creating donation:', error);
        return throwError(() => new Error('Failed to create donation'));
      })
    );
  }

  updateDonation(
    id: string,
    donationData: Partial<Donation>
  ): Observable<Donation> {
    return this.http.patch<Donation>(`${this.apiUrl}/${id}`, donationData).pipe(
      catchError((error) => {
        console.error(`Error updating donation with ID ${id}:`, error);
        return throwError(() => new Error('Failed to update donation'));
      })
    );
  }

  deleteDonation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting donation with ID ${id}:`, error);
        return throwError(() => new Error('Failed to delete donation'));
      })
    );
  }

  updateDonationStatus(
    id: string,
    status: DonationStatus
  ): Observable<Donation> {
    return this.http
      .patch<Donation>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError((error) => {
          console.error(
            `Error updating status for donation with ID ${id}:`,
            error
          );
          return throwError(
            () => new Error('Failed to update donation status')
          );
        })
      );
  }
}
