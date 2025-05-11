import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Stock,
  StockItem,
  StockRequest,
  StockResponse,
  StockAdjustment,
} from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getAllStockItems(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(this.apiUrl);
  }

  getStockById(id: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`);
  }

  getStockItemById(id: string): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.apiUrl}/${id}`);
  }

  getStockByProduct(productId: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/product/${productId}`);
  }

  getStockBySource(source: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/source/${source}`);
  }

  createStock(stock: StockRequest): Observable<StockResponse> {
    return this.http.post<StockResponse>(this.apiUrl, stock);
  }

  addToStock(stockData: StockRequest): Observable<StockResponse> {
    return this.http.post<StockResponse>(this.apiUrl, stockData);
  }

  updateStock(
    id: string,
    stock: Partial<StockRequest>
  ): Observable<StockResponse> {
    return this.http.put<StockResponse>(`${this.apiUrl}/${id}`, stock);
  }

  updateStockItem(
    id: string,
    stockData: Partial<StockRequest>
  ): Observable<StockResponse> {
    return this.http.put<StockResponse>(`${this.apiUrl}/${id}`, stockData);
  }

  deleteStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  removeFromStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adjustStock(adjustmentData: StockAdjustment): Observable<StockResponse> {
    return this.http.post<StockResponse>(
      `${this.apiUrl}/adjust`,
      adjustmentData
    );
  }
}
