import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockItem, StockRequest, StockResponse } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StocksService {
  private apiUrl = `${environment.apiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  getStocks(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(this.apiUrl);
  }

  getStockById(id: string): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.apiUrl}/${id}`);
  }

  getStockItemsByProduct(productId: string): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${this.apiUrl}/product/${productId}`);
  }

  createStock(stock: StockRequest): Observable<StockResponse> {
    return this.http.post<StockResponse>(this.apiUrl, stock);
  }

  updateStock(
    id: string,
    stock: Partial<StockRequest>
  ): Observable<StockResponse> {
    return this.http.put<StockResponse>(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
