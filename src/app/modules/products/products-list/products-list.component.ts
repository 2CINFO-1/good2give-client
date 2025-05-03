import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  categoryFilter = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data
      this.products = [
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
        {
          _id: 'prod5',
          name: 'Sugar',
          category: 'Baking',
          unit: 'kg',
          description: 'White sugar',
          minStock: 25,
        },
        {
          _id: 'prod6',
          name: 'Oil',
          category: 'Cooking',
          unit: 'liter',
          description: 'Vegetable oil',
          minStock: 20,
        },
        {
          _id: 'prod7',
          name: 'Salt',
          category: 'Seasoning',
          unit: 'kg',
          description: 'Table salt',
          minStock: 10,
        },
        {
          _id: 'prod8',
          name: 'Maize',
          category: 'Grains',
          unit: 'kg',
          description: 'Yellow maize',
          minStock: 80,
        },
      ];

      // Apply filter and pagination
      this.applyFilters();
      this.loading = false;
    }, 1000);
  }

  applyFilters(): void {
    // Filter by search term and category
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = this.searchTerm
        ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product
            .description!.toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        : true;

      const matchesCategory = this.categoryFilter
        ? product.category === this.categoryFilter
        : true;

      return matchesSearch && matchesCategory;
    });

    // Update total count for pagination
    this.totalItems = this.filteredProducts.length;

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = this.filteredProducts.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  createProduct(): void {
    this.router.navigate(['/dashboard/products/create']);
  }

  viewProduct(id: string): void {
    this.router.navigate(['/dashboard/products', id]);
  }

  get categories(): string[] {
    // Extract unique categories from products
    return [...new Set(this.products.map((product) => product.category))];
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.totalItems / this.pageSize))
      .fill(0)
      .map((_, index) => index + 1);
  }
}
