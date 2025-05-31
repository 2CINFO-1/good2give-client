import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Stock,
  StockRequest,
  StockUpdateRequest,
  StockResponse,
} from '../models/stock.model';

/**
 * Service for managing stock items
 * Maps to backend /stocks endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  /**
   * Get all stocks with optional pagination
   * @param page Page number
   * @param limit Items per page
   * @returns Observable of stock array
   */
  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all stocks', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get stocks with pagination
   * @param page Page number
   * @param limit Items per page
   * @returns Observable of stock array
   */
  getStocks(page: number = 1, limit: number = 10): Observable<Stock[]> {
    let params = new HttpParams()
      

    return this.http.get<Stock[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching stocks', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get stock by ID
   * @param id Stock ID
   * @returns Observable of a single stock
   */
  getStockById(id: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching stock with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new stock
   * @param stockData Stock creation data
   * @returns Observable of created stock
   */
  createStock(stockData: StockRequest): Observable<StockResponse> {
    return this.http.post<StockResponse>(this.apiUrl, stockData).pipe(
      catchError((error) => {
        console.error('Error creating stock', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update stock by ID
   * @param id Stock ID
   * @param stockData Stock update data
   * @returns Observable of updated stock
   */
  updateStock(
    id: string,
    stockData: StockUpdateRequest
  ): Observable<StockResponse> {
    return this.http.put<StockResponse>(`${this.apiUrl}/${id}`, stockData).pipe(
      catchError((error) => {
        console.error(`Error updating stock with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete stock by ID
   * @param id Stock ID
   * @returns Observable of boolean indicating success
   */
  deleteStock(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting stock with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get stocks by product ID
   * @param productId Product ID
   * @returns Observable of stock array for the given product
   */
  getStocksByProduct(productId: string): Observable<Stock[]> {
    const params = new HttpParams().set('productId', productId);
    return this.http.get<Stock[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching stocks for product ${productId}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get stocks by donator ID
   * @param donatorId Donator ID
   * @returns Observable of stock array for the given donator
   */
  getStocksByDonator(donatorId: string): Observable<Stock[]> {
    const params = new HttpParams().set('donatorId', donatorId);
    return this.http.get<Stock[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching stocks for donator ${donatorId}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Release stock
   * @param id Stock ID
   * @param releasedAt Release date
   * @returns Observable of updated stock
   */
  releaseStock(id: string, releasedAt: string): Observable<StockResponse> {
    return this.updateStock(id, { releasedAt });
  }
}
