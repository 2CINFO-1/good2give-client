import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  FoodScrap,
  FoodScrapRequest,
  FoodScrapResponse,
  // Legacy types kept for backward compatibility
} from '../models/scrap.model';

/**
 * Service for managing food scrapping events
 * Maps to backend /scraps endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class ScrapService {
  private apiUrl = `${environment.apiUrl}/scraps`;

  constructor(private http: HttpClient) {}

  /**
   * Get all food scraps
   * @returns Observable of food scrap array
   */
  getAllScraps(): Observable<FoodScrap[]> {
    return this.http.get<FoodScrap[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching scraps', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a food scrap by ID
   * @param id Scrap ID
   * @returns Observable of a single food scrap
   */
  getScrapById(id: string): Observable<FoodScrap> {
    return this.http.get<FoodScrap>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching scrap with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new food scrap
   * @param scrapData Scrap data
   * @returns Observable of created food scrap
   */
  createScrap(scrapData: FoodScrapRequest): Observable<FoodScrapResponse> {
    return this.http.post<FoodScrapResponse>(this.apiUrl, scrapData).pipe(
      catchError((error) => {
        console.error('Error creating scrap', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing food scrap
   * @param id Scrap ID
   * @param scrapData Scrap data to update
   * @returns Observable of updated food scrap
   */
  updateScrap(
    id: string,
    scrapData: Partial<FoodScrapRequest>
  ): Observable<FoodScrapResponse> {
    return this.http
      .put<FoodScrapResponse>(`${this.apiUrl}/${id}`, scrapData)
      .pipe(
        catchError((error) => {
          console.error(`Error updating scrap with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a food scrap
   * @param id Scrap ID
   * @returns Observable of boolean indicating success
   */
  deleteScrap(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting scrap with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get scraps by beneficiary
   * @param beneficiaryId Beneficiary user ID
   * @returns Observable of food scrap array filtered by beneficiary
   */
  getScrapsByBeneficiary(beneficiaryId: string): Observable<FoodScrap[]> {
    const params = new HttpParams().set('beneficiaryid', beneficiaryId);
    return this.http.get<FoodScrap[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(
          `Error fetching scraps by beneficiary ${beneficiaryId}`,
          error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Get my scraps (current user's scraps)
   * @returns Observable of food scrap array for current user
   */
  getMyFoodScraps(): Observable<FoodScrap[]> {
    return this.http.get<FoodScrap[]>(`${this.apiUrl}/my-scraps`).pipe(
      catchError((error) => {
        console.error('Error fetching user scraps', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get scraps by date range
   * @param startDate Start date in ISO format
   * @param endDate End date in ISO format
   * @returns Observable of food scrap array filtered by date range
   */
  getScrapsByDateRange(
    startDate: string,
    endDate: string
  ): Observable<FoodScrap[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<FoodScrap[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching scraps by date range`, error);
        return throwError(() => error);
      })
    );
  }

  // Legacy methods maintained for backward compatibility
  // These should be gradually phased out

  /**
   * @deprecated Use methods above instead
   */
  getAllFoodScraps(): Observable<FoodScrap[]> {
    return this.getAllScraps();
  }

  /**
   * @deprecated Use methods above instead
   */
  getFoodScrapById(id: string): Observable<FoodScrap> {
    return this.getScrapById(id);
  }

  /**
   * @deprecated Use methods above instead
   */
  createFoodScrap(scrapData: FoodScrapRequest): Observable<FoodScrapResponse> {
    return this.createScrap(scrapData);
  }

  /**
   * @deprecated Use methods above instead
   */
  updateFoodScrap(
    id: string,
    scrapData: Partial<FoodScrapRequest>
  ): Observable<FoodScrapResponse> {
    return this.updateScrap(id, scrapData);
  }

  /**
   * @deprecated Use methods above instead
   */
  deleteFoodScrap(id: string): Observable<boolean> {
    return this.deleteScrap(id);
  }
}
