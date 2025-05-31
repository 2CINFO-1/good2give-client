import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProducts: Set<string> = new Set(); // Track selected product IDs
  loading = true;
  error: string | null = null;
  successMessage = '';
  productToDelete: Product | null = null;
  productsToDelete: Product[] = []; // For bulk delete
  showDeleteModal = false;
  Math = Math;
  showArchived = false;

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
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.checkPermissions();
  }

  checkPermissions(): void {
    this.canEdit = this.authService.hasRole(['admin', 'product-manager']);
    this.canDelete = this.authService.hasRole(['admin']);
  }

  // Toggle product selection
  toggleSelection(productId: string): void {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
  }

  // Select or deselect all products on the current page
  toggleSelectAll(): void {
    if (this.selectedProducts.size === this.filteredProducts.length) {
      this.selectedProducts.clear();
    } else {
      this.filteredProducts.forEach((product) =>
        this.selectedProducts.add(product._id)
      );
    }
  }

  // Check if all products on the current page are selected
  isAllSelected(): boolean {
    return (
      this.filteredProducts.length > 0 &&
      this.filteredProducts.every((product) =>
        this.selectedProducts.has(product._id)
      )
    );
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        if (!this.showArchived) {
          this.products = this.products.filter(
            (product) => product.status !== 'Inactive'
          );
        }
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', err);
      },
    });
  }

  applyFilters(): void {
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

    this.totalItems = this.filteredProducts.length;
    this.calculateTotalPages();

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
    this.router.navigate([`/dashboard/products/${id}`]);
  }

  editProduct(id: string): void {
    this.router.navigate([`/dashboard/products/edit/${id}`]);
  }

  confirmDelete(product: Product | null = null): void {
    if (product) {
      // Single product deletion
      this.productToDelete = product;
      this.productsToDelete = [];
    } else {
      // Bulk deletion
      this.productToDelete = null;
      this.productsToDelete = this.products.filter((p) =>
        this.selectedProducts.has(p._id)
      );
    }
    this.showDeleteModal = true;
  }

  deleteProduct(): void {
    if (this.productToDelete) {
      // Single product deletion
      this.loading = true;
      this.productService.deleteProduct(this.productToDelete._id).subscribe({
        next: () => {
          this.successMessage = `Product "${this.productToDelete?.name}" was successfully deleted.`;
          this.loadProducts();
          this.cancelDelete();
        },
        error: (err: any) => {
          this.error = err.message || 'Failed to delete product';
          this.loading = false;
          this.cancelDelete();
        },
      });
    } else if (this.productsToDelete.length > 0) {
      // Bulk deletion
      this.loading = true;
      const deleteObservables = this.productsToDelete.map((product) =>
        this.productService.deleteProduct(product._id)
      );
      // Use forkJoin to handle multiple deletions
      import('rxjs').then((rxjs) => {
        rxjs.forkJoin(deleteObservables).subscribe({
          next: () => {
            this.successMessage = `${this.productsToDelete.length} products were successfully deleted.`;
            this.selectedProducts.clear();
            this.loadProducts();
            this.cancelDelete();
          },
          error: (err: any) => {
            this.error = err.message || 'Failed to delete some products';
            this.loading = false;
            this.cancelDelete();
          },
        });
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
    this.productsToDelete = [];
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages.length) return;
    this.currentPage = page;
    this.applyFilters();
  }

  getStockStatusText(product: Product): string {
    if (product.status === 'inactive') return 'Out of Stock';
    return 'In Stock';
  }

  getStockStatusClass(product: Product): string {
    const status = this.getStockStatusText(product);
    if (status === 'Out of Stock') return 'bg-red-100 text-red-800';
    if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  toggleArchivedProducts(): void {
    this.showArchived = !this.showArchived;
    this.loadProducts();
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }
}
