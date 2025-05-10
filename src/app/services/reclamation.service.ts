import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Reclamation,
  ReclamationRequest,
  ReclamationResponse,
} from '../models/reclamation.model';
import {
  ReclamationResolution,
  ReclamationResolutionRequest,
  ReclamationResolutionResponse,
} from '../models/reclamation-res.model';

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = `${environment.apiUrl}/reclamations`;
  private resolutionUrl = `${environment.apiUrl}/reclamations-res`;

  constructor(private http: HttpClient) {}

  // Reclamation endpoints
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  getReclamationById(id: string): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }

  createReclamation(data: ReclamationRequest): Observable<ReclamationResponse> {
    return this.http.post<ReclamationResponse>(this.apiUrl, data);
  }

  updateReclamation(
    id: string,
    data: Partial<ReclamationRequest>
  ): Observable<ReclamationResponse> {
    return this.http.put<ReclamationResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteReclamation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // User-specific reclamations
  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/my-reclamations`);
  }

  // Reclamation Resolution endpoints
  getAllResolutions(): Observable<ReclamationResolution[]> {
    return this.http.get<ReclamationResolution[]>(this.resolutionUrl);
  }

  getResolutionById(id: string): Observable<ReclamationResolution> {
    return this.http.get<ReclamationResolution>(`${this.resolutionUrl}/${id}`);
  }

  createResolution(
    data: ReclamationResolutionRequest
  ): Observable<ReclamationResolutionResponse> {
    return this.http.post<ReclamationResolutionResponse>(
      this.resolutionUrl,
      data
    );
  }

  updateResolution(
    id: string,
    data: Partial<ReclamationResolutionRequest>
  ): Observable<ReclamationResolutionResponse> {
    return this.http.put<ReclamationResolutionResponse>(
      `${this.resolutionUrl}/${id}`,
      data
    );
  }

  deleteResolution(id: string): Observable<void> {
    return this.http.delete<void>(`${this.resolutionUrl}/${id}`);
  }

  // Get resolutions for a specific reclamation
  getResolutionsForReclamation(
    reclamationId: string
  ): Observable<ReclamationResolution[]> {
    return this.http.get<ReclamationResolution[]>(
      `${this.apiUrl}/${reclamationId}/resolutions`
    );
  }
}
