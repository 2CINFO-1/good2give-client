import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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

  getCollectes(): Observable<Collecte[]> {
    return this.http.get<Collecte[]>(this.apiUrl);
  }

  getCollecteById(id: string): Observable<Collecte> {
    return this.http.get<Collecte>(`${this.apiUrl}/${id}`);
  }

  createCollecte(collecte: CollecteRequest): Observable<CollecteResponse> {
    return this.http.post<CollecteResponse>(this.apiUrl, collecte);
  }

  updateCollecte(
    id: string,
    collecte: Partial<CollecteRequest>
  ): Observable<CollecteResponse> {
    return this.http.put<CollecteResponse>(`${this.apiUrl}/${id}`, collecte);
  }

  deleteCollecte(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
