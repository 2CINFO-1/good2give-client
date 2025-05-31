import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { StockService } from '../../../core/services/stock.service';
import { Product } from '../../../core/models/product.model';
import { Stock } from '../../../core/models/stock.model';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProductDetailsComponent implements OnInit {
  productId = '';
  product: Product | null = null;
  stockItems: Stock[] = [];
  loading = true;
  error: string | null = null;
  canEdit = false;
  canDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private stockService: StockService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.productId) {
      this.error = 'Product ID is missing';
      this.loading = false;
      return;
    }

    this.checkPermissions();
    this.loadProductDetails();
  }

  loadProductDetails(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loadStockItems();
      },
      error: (err: Error) => {
        this.error = 'Failed to load product details. Please try again later.';
        this.loading = false;
        console.error('Error loading product:', err);
      },
    });
  }

  loadStockItems(): void {
    if (!this.productId) return;

    this.stockService.getStocksByProduct(this.productId).subscribe({
      next: (items: Stock[]) => {
        this.stockItems = items;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error =
          'Failed to load stock information. Product details are still available.';
        this.loading = false;
        console.error('Error loading stock items:', err);
      },
    });
  }

  checkPermissions(): void {
    const currentUser = this.authService.getCurrentUser();
    this.canEdit = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.INSPECTOR;
    this.canDelete = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.INSPECTOR;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }

  goToProductDetail(): void {
    if (this.productId) {
      this.router.navigate(['/dashboard/products', this.productId]);
    }
  }

  editProduct(): void {
    if (this.productId) {
      this.router.navigate(['/dashboard/products/edit', this.productId]);
    }
  }

  deleteProduct(): void {
    if (this.product && confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.productService.deleteProduct(this.product._id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/products']);
        },
        error: (error) => {
          this.error = 'Failed to delete product. Please try again.';
          this.loading = false;
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  getDonatorName(donatorId: string | User): string {
    if (typeof donatorId === 'object' && donatorId !== null && 'name' in donatorId) {
      return donatorId.name;
    }
    return String(donatorId);
  }

  getStockStatus(stock: Stock): string {
    return stock.releasedAt ? 'Released' : 'Available';
  }

  isExpired(dateString: string): boolean {
    if (!dateString) return false;

    const expirationDate = new Date(dateString);
    return expirationDate < new Date();
  }

  isExpiringSoon(dateString: string): boolean {
    if (!dateString) return false;

    const expirationDate = new Date(dateString);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expirationDate > today && expirationDate <= thirtyDaysFromNow;
  }
}
