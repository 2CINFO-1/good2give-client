import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Product,
  ProductCategory,
  ProductType,
} from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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
  successMessage = '';
  productToDelete: Product | null = null;
  showDeleteModal = false;
  Math = Math;

  // Permissions
  canEdit = false;
  canDelete = false;

  // Filters
  filter = {
    category: '',
    stockStatus: '',
    search: '',
  };

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages: number[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.checkPermissions();
  }

  checkPermissions(): void {
    this.canEdit = this.authService.hasPermission('products:edit');
    this.canDelete = this.authService.hasPermission('products:delete');
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load products';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    // Filter by search term and category
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = this.filter.search
        ? product.name
            .toLowerCase()
            .includes(this.filter.search.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(this.filter.search.toLowerCase()))
        : true;

      const matchesCategory = this.filter.category
        ? product.category === this.filter.category
        : true;

      const matchesStockStatus = this.filter.stockStatus
        ? this.getStockStatusText(product).toLowerCase() ===
          this.filter.stockStatus.toLowerCase()
        : true;

      return matchesSearch && matchesCategory && matchesStockStatus;
    });

    // Update total count for pagination
    this.totalItems = this.filteredProducts.length;
    this.calculateTotalPages();

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = this.filteredProducts.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  calculateTotalPages(): void {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    this.totalPages = Array(pageCount)
      .fill(0)
      .map((_, index) => index + 1);
  }

  getPageNumbers(): number[] {
    return this.totalPages;
  }

  clearSearch(): void {
    this.filter.search = '';
    this.applyFilters();
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  createProduct(): void {
    this.router.navigate(['/dashboard/products/create']);
  }

  addProduct(): void {
    this.router.navigate(['/dashboard/products/create']);
  }

  viewProduct(id: string): void {
    this.router.navigate(['/dashboard/products', id]);
  }

  editProduct(id: string): void {
    this.router.navigate(['/dashboard/products/edit', id]);
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;

    this.loading = true;
    this.productsService.deleteProduct(this.productToDelete._id).subscribe({
      next: () => {
        this.successMessage = `Product "${this.productToDelete?.name}" was successfully deleted.`;
        this.loadProducts();
        this.cancelDelete();
      },
      error: (err) => {
        this.error = err.message || 'Failed to delete product';
        this.loading = false;
        this.cancelDelete();
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages.length) return;
    this.currentPage = page;
    this.applyFilters();
  }

  getStockStatusText(product: Product): string {
    // In a real application, this would check actual stock levels
    // For now, we'll just return a placeholder based on product status
    if (product.status === 'inactive') return 'Out of Stock';
    return 'In Stock';
  }

  getStockStatusClass(product: Product): string {
    const status = this.getStockStatusText(product);
    if (status === 'Out of Stock') return 'bg-red-100 text-red-800';
    if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }
}
