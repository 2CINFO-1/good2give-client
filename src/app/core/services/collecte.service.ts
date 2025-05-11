import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Collecte,
  CollecteRequest,
  CollecteResponse,
} from '../models/collecte.model';

@Injectable({
  providedIn: 'root',
})
export class CollecteService {
  private apiUrl = `${environment.apiUrl}/collectes`;

  constructor(private http: HttpClient) {}

  /**
   * Get all collectes
   * @returns Observable of collecte array
   */
  getAllCollectes(): Observable<Collecte[]> {
    return this.http.get<Collecte[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching collectes', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a collecte by ID
   * @param id Collecte ID
   * @returns Observable of a single collecte
   */
  getCollecteById(id: string): Observable<Collecte> {
    return this.http.get<Collecte>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching collecte with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new collecte
   * @param collecte Collecte data
   * @returns Observable of created collecte
   */
  createCollecte(collecte: CollecteRequest): Observable<CollecteResponse> {
    return this.http.post<CollecteResponse>(this.apiUrl, collecte).pipe(
      catchError((error) => {
        console.error('Error creating collecte', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing collecte
   * @param id Collecte ID
   * @param collecte Collecte data to update
   * @returns Observable of updated collecte
   */
  updateCollecte(
    id: string,
    collecte: Partial<CollecteRequest>
  ): Observable<CollecteResponse> {
    return this.http
      .put<CollecteResponse>(`${this.apiUrl}/${id}`, collecte)
      .pipe(
        catchError((error) => {
          console.error(`Error updating collecte with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a collecte
   * @param id Collecte ID
   * @returns Observable of boolean indicating success
   */
  deleteCollecte(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting collecte with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }
}
