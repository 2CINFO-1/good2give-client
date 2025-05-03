import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getStockById(id: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`);
  }

  getStockByProduct(productId: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/product/${productId}`);
  }

  createStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  updateStock(id: string, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adjustStock(adjustmentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adjust`, adjustmentData);
  }
}
