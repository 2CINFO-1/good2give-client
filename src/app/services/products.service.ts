import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  // Mock data for now
  private mockProducts: Product[] = [
    {
      _id: 'prod1',
      name: 'Rice',
      category: 'Grains',
      unit: 'kg',
      description: 'White rice',
      minStock: 100,
    },
    {
      _id: 'prod2',
      name: 'Beans',
      category: 'Legumes',
      unit: 'kg',
      description: 'Red beans',
      minStock: 50,
    },
    {
      _id: 'prod3',
      name: 'Milk',
      category: 'Dairy',
      unit: 'liter',
      description: 'Whole milk',
      minStock: 30,
    },
    {
      _id: 'prod4',
      name: 'Flour',
      category: 'Baking',
      unit: 'kg',
      description: 'All-purpose flour',
      minStock: 40,
    },
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // Simulate API call with delay
    return of(this.mockProducts).pipe(delay(500));
    // In production use:
    // return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    // Find product in mock data
    const product = this.mockProducts.find((p) => p._id === id);
    if (product) {
      return of(product).pipe(delay(300));
    }
    // In production use:
    // return this.http.get<Product>(`${this.apiUrl}/${id}`);
    return of({} as Product);
  }

  createProduct(product: Product): Observable<Product> {
    // Simulate API call with delay
    const newProduct = {
      ...product,
      id: 'prod' + (this.mockProducts.length + 1),
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(500));
    // In production use:
    // return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    // Update mock product
    const index = this.mockProducts.findIndex((p) => p._id === id);
    if (index !== -1) {
      const updatedProduct = { ...product, _id: id };
      this.mockProducts[index] = updatedProduct;
      return of(updatedProduct).pipe(delay(500));
    }
    // In production use:
    // return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    return of({} as Product);
  }

  deleteProduct(id: string): Observable<void> {
    // Remove from mock data
    const index = this.mockProducts.findIndex((p) => p._id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
    }
    return of(undefined).pipe(delay(500));
    // In production use:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
