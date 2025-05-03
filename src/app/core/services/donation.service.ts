import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Donation, DonationRequest } from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiUrl = `${environment.apiUrl}/donations`;

  constructor(private http: HttpClient) {}

  getDonations(
    params: any = {}
  ): Observable<{ results: Donation[]; total: number }> {
    return this.http.get<{ results: Donation[]; total: number }>(this.apiUrl, {
      params,
    });
  }

  getDonationById(id: string): Observable<Donation> {
    return this.http.get<Donation>(`${this.apiUrl}/${id}`);
  }

  createDonation(donation: DonationRequest): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, donation);
  }

  updateDonation(
    id: string,
    donation: Partial<DonationRequest>
  ): Observable<Donation> {
    return this.http.patch<Donation>(`${this.apiUrl}/${id}`, donation);
  }

  deleteDonation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional donation-specific methods
  cancelDonation(id: string, reason: string): Observable<Donation> {
    return this.http.post<Donation>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  getDonationsByUser(
    userId: string
  ): Observable<{ results: Donation[]; total: number }> {
    return this.http.get<{ results: Donation[]; total: number }>(
      `${this.apiUrl}/user/${userId}`
    );
  }
}
