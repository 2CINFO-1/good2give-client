import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Reclamation,
  ReclamationRequest,
  ReclamationResponse,
  ReclamationResolution,
  ReclamationResolutionRequest,
  ReclamationResolutionResponse,
  ReclamationStatus,
} from '../models/reclamation.model';

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = `${environment.apiUrl}/reclamations`;
  private resolutionUrl = `${environment.apiUrl}/reclamation-res`;

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
    data: Partial<ReclamationRequest>
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
   * @returns Observable of boolean indicating success
   */
  deleteReclamation(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting reclamation with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get reclamations for the current user
   * @returns Observable of reclamation array
   */
  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/my-reclamations`).pipe(
      catchError((error) => {
        console.error('Error fetching user reclamations', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get reclamations by status
   * @param status Reclamation status
   * @returns Observable of reclamation array filtered by status
   */
  getReclamationsByStatus(
    status: ReclamationStatus
  ): Observable<Reclamation[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Reclamation[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching reclamations by status ${status}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update reclamation status
   * @param id Reclamation ID
   * @param status New status
   * @returns Observable of updated reclamation
   */
  updateReclamationStatus(
    id: string,
    status: ReclamationStatus
  ): Observable<ReclamationResponse> {
    return this.http
      .patch<ReclamationResponse>(`${this.apiUrl}/${id}/status`, {
        status,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `Error updating status for reclamation with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  // Reclamation Resolution endpoints
  /**
   * Get all resolutions
   * @returns Observable of resolution array
   */
  getAllResolutions(): Observable<ReclamationResolution[]> {
    return this.http.get<ReclamationResolution[]>(this.resolutionUrl).pipe(
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
  getResolutionById(id: string): Observable<ReclamationResolution> {
    return this.http
      .get<ReclamationResolution>(`${this.resolutionUrl}/${id}`)
      .pipe(
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
    data: ReclamationResolutionRequest
  ): Observable<ReclamationResolutionResponse> {
    return this.http
      .post<ReclamationResolutionResponse>(this.resolutionUrl, data)
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
    data: Partial<ReclamationResolutionRequest>
  ): Observable<ReclamationResolutionResponse> {
    return this.http
      .put<ReclamationResolutionResponse>(`${this.resolutionUrl}/${id}`, data)
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
   * @returns Observable of boolean indicating success
   */
  deleteResolution(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.resolutionUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting resolution with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get resolutions for a specific reclamation
   * @param reclamationId Reclamation ID
   * @returns Observable of resolution array
   */
  getResolutionsForReclamation(
    reclamationId: string
  ): Observable<ReclamationResolution[]> {
    return this.http
      .get<ReclamationResolution[]>(
        `${this.resolutionUrl}?reclamid=${reclamationId}`
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

  // Add photo to reclamation
  addReclamationPhoto(
    id: string,
    photo: File
  ): Observable<ReclamationResponse> {
    const formData = new FormData();
    formData.append('photo', photo);

    return this.http.post<ReclamationResponse>(
      `${this.apiUrl}/${id}/photos`,
      formData
    );
  }

  // Delete photo from reclamation
  deleteReclamationPhoto(
    id: string,
    photoUrl: string
  ): Observable<ReclamationResponse> {
    return this.http.delete<ReclamationResponse>(
      `${this.apiUrl}/${id}/photos`,
      { body: { photoUrl } }
    );
  }
}
