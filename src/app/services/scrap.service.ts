import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FoodScrap,
  FoodScrapRequest,
  FoodScrapResponse,
} from '../models/scrap.model';

@Injectable({
  providedIn: 'root',
})
export class ScrapService {
  private apiUrl = `${environment.apiUrl}/scraps`;

  constructor(private http: HttpClient) {}

  getAllScraps(): Observable<FoodScrap[]> {
    return this.http.get<FoodScrap[]>(this.apiUrl);
  }

  getScrapById(id: string): Observable<FoodScrap> {
    return this.http.get<FoodScrap>(`${this.apiUrl}/${id}`);
  }

  createScrap(scrapData: FoodScrapRequest): Observable<FoodScrapResponse> {
    return this.http.post<FoodScrapResponse>(this.apiUrl, scrapData);
  }

  updateScrap(
    id: string,
    scrapData: Partial<FoodScrapRequest>
  ): Observable<FoodScrapResponse> {
    return this.http.put<FoodScrapResponse>(`${this.apiUrl}/${id}`, scrapData);
  }

  deleteScrap(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods for specific actions
  getMyScraps(): Observable<FoodScrap[]> {
    return this.http.get<FoodScrap[]>(`${this.apiUrl}/my-scraps`);
  }
}
