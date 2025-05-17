import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { StockService } from '../../../core/services/stock.service';
import { Product } from '../../../core/models/product.model';
import { Stock } from '../../../core/models/stock.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  stockItems: Stock[] = [];
  loading: boolean = true;
  error: string | null = null;
  canEdit: boolean = false;

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

    this.loadProductDetails();
    this.checkUserPermissions();
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

  checkUserPermissions(): void {
    const currentUser = this.authService.getCurrentUser();
    // Check if user has admin role which allows product editing
    this.canEdit = Boolean(currentUser && currentUser.role === 'admin');
  }

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }

  editProduct(): void {
    if (this.productId) {
      this.router.navigate(['/dashboard/products/edit', this.productId]);
    }
  }

  getDonatorName(donatorId: any): string {
    if (donatorId && typeof donatorId !== 'string' && donatorId.name) {
      return donatorId.name;
    }
    return 'Unknown';
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
