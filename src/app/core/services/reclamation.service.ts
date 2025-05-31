import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Reclamation,
  ReclamationRequest,
  ReclamationUpdateRequest,
  ReclamationResponse,
  ReclamationRES,
  ReclamationRESRequest,
  ReclamationRESResponse,
  ReclamationStatus,
  // Backward compatibility aliases
  ReclamationResolution,
  ReclamationResolutionRequest,
  ReclamationResolutionResponse,
} from '../models/reclamation.model';

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = `${environment.apiUrl}/reclamations`;
  private resolutionUrl = `${environment.apiUrl}/reclamationRES`;

  constructor(private http: HttpClient) {}

  /**
   * Get all reclamations
   * @returns Observable of reclamation array
   */
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching reclamations', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a reclamation by ID
   * @param id Reclamation ID
   * @returns Observable of a single reclamation
   */
  getReclamationById(id: string): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching reclamation with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new reclamation
   * @param data Reclamation data
   * @returns Observable of created reclamation
   */
  createReclamation(data: ReclamationRequest): Observable<ReclamationResponse> {
    return this.http.post<ReclamationResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating reclamation', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing reclamation
   * @param id Reclamation ID
   * @param data Reclamation data to update
   * @returns Observable of updated reclamation
   */
  updateReclamation(
    id: string,
    data: ReclamationUpdateRequest
  ): Observable<ReclamationResponse> {
    return this.http
      .put<ReclamationResponse>(`${this.apiUrl}/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error(`Error updating reclamation with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a reclamation
   * @param id Reclamation ID
   * @returns Observable of success message
   */
  deleteReclamation(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting reclamation with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  // ReclamationRES endpoints
  /**
   * Get all resolutions
   * @returns Observable of resolution array
   */
  getAllResolutions(): Observable<ReclamationRES[]> {
    return this.http.get<ReclamationRES[]>(this.resolutionUrl).pipe(
      catchError((error) => {
        console.error('Error fetching reclamation resolutions', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a resolution by ID
   * @param id Resolution ID
   * @returns Observable of a single resolution
   */
  getResolutionById(id: string): Observable<ReclamationRES> {
    return this.http.get<ReclamationRES>(`${this.resolutionUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching resolution with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new resolution
   * @param data Resolution data
   * @returns Observable of created resolution
   */
  createResolution(
    data: ReclamationRESRequest
  ): Observable<ReclamationRESResponse> {
    return this.http
      .post<ReclamationRESResponse>(this.resolutionUrl, data)
      .pipe(
        catchError((error) => {
          console.error('Error creating resolution', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update an existing resolution
   * @param id Resolution ID
   * @param data Resolution data to update
   * @returns Observable of updated resolution
   */
  updateResolution(
    id: string,
    data: Partial<ReclamationRESRequest>
  ): Observable<ReclamationRESResponse> {
    return this.http
      .put<ReclamationRESResponse>(`${this.resolutionUrl}/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error(`Error updating resolution with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a resolution
   * @param id Resolution ID
   * @returns Observable of success message
   */
  deleteResolution(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.resolutionUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error(`Error deleting resolution with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get suggestions for a reclamation
   * @param reclamationId Reclamation ID
   * @returns Observable of suggestions
   */
  getSuggestions(
    reclamationId: string
  ): Observable<{ suggestion: string; confidence: number; reasoning: string }> {
    return this.http
      .get<{ suggestion: string; confidence: number; reasoning: string }>(
        `${this.resolutionUrl}/suggestions/${reclamationId}`
      )
      .pipe(
        catchError((error) => {
          console.error(
            `Error fetching suggestions for reclamation ${reclamationId}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  /**
   * Get resolutions for a specific reclamation
   * @param reclamationId Reclamation ID
   * @returns Observable of resolutions array
   */
  getResolutionsForReclamation(
    reclamationId: string
  ): Observable<ReclamationRES[]> {
    return this.http
      .get<ReclamationRES[]>(
        `${this.resolutionUrl}/reclamation/${reclamationId}`
      )
      .pipe(
        catchError((error) => {
          console.error(
            `Error fetching resolutions for reclamation ${reclamationId}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  // Backward compatibility methods
  getAllReclamationResolutions(): Observable<ReclamationResolution[]> {
    return this.getAllResolutions();
  }

  getReclamationResolutionById(id: string): Observable<ReclamationResolution> {
    return this.getResolutionById(id);
  }

  createReclamationResolution(
    data: ReclamationResolutionRequest
  ): Observable<ReclamationResolutionResponse> {
    return this.createResolution(data);
  }

  updateReclamationResolution(
    id: string,
    data: Partial<ReclamationResolutionRequest>
  ): Observable<ReclamationResolutionResponse> {
    return this.updateResolution(id, data);
  }

  deleteReclamationResolution(id: string): Observable<{ message: string }> {
    return this.deleteResolution(id);
  }
}
