import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Stock, StockRequest, StockResponse } from '../core/models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  getAllStockItems(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getStockItemById(id: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`);
  }

  addToStock(stockData: StockRequest): Observable<StockResponse> {
    return this.http.post<StockResponse>(this.apiUrl, stockData);
  }

  updateStockItem(
    id: string,
    stockData: Partial<StockRequest>
  ): Observable<StockResponse> {
    return this.http.put<StockResponse>(`${this.apiUrl}/${id}`, stockData);
  }

  removeFromStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods for specific stock operations
  getStockBySource(source: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/source/${source}`);
  }

  getStockByProduct(productId: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/product/${productId}`);
  }
}
