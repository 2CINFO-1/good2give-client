import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Product,
  ProductRequest,
  ProductStatus,
} from '../models/product.model';

/**
 * Service for managing products
 * Maps to backend /products endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get all products
   * @returns Observable of product array
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching products', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a product by ID
   * @param id Product ID
   * @returns Observable of a single product
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching product with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new product
   * @param product Product data
   * @returns Observable of created product
   */
  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError((error) => {
        console.error('Error creating product', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param product Product data to update
   * @returns Observable of updated product
   */
  updateProduct(
    id: string,
    product: Partial<ProductRequest>
  ): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError((error) => {
        console.error(`Error updating product with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a product
   * @param id Product ID
   * @returns Observable of boolean indicating success
   */
  deleteProduct(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting product with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get products by category
   * @param category Product category
   * @returns Observable of product array filtered by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching products by category ${category}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get products by type
   * @param type Product type
   * @returns Observable of product array filtered by type
   */
  getProductsByType(type: string): Observable<Product[]> {
    const params = new HttpParams().set('productType', type);
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching products by type ${type}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get products by donator
   * @param donatorId Donator user ID
   * @returns Observable of product array filtered by donator
   */
  getProductsByDonator(donatorId: string): Observable<Product[]> {
    const params = new HttpParams().set('donatorId', donatorId);
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching products by donator ${donatorId}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get products by status
   * @param status Product status
   * @returns Observable of product array filtered by status
   */
  getProductsByStatus(status: ProductStatus | string): Observable<Product[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(`Error fetching products by status ${status}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search products
   * @param query Search query
   * @returns Observable of product array matching search query
   */
  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError((error) => {
        console.error(`Error searching products with query ${query}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update product status
   * @param id Product ID
   * @param status New status
   * @returns Observable of updated product
   */
  updateProductStatus(
    id: string,
    status: ProductStatus | string
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError((error) => {
          console.error(
            `Error updating status for product with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }
}
