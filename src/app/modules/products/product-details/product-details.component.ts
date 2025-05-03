import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { StocksService } from '../../../services/stocks.service';
import { Product } from '../../../models/product.model';
import { StockItem } from '../../../models/stock.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  stockItems: StockItem[] = [];
  loading: boolean = true;
  error: string | null = null;
  canEdit: boolean = false;
  displayAllergens: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private stocksService: StocksService,
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

    this.productsService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.processProductData();
        this.loadStockItems();
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again later.';
        this.loading = false;
        console.error('Error loading product:', err);
      },
    });
  }

  loadStockItems(): void {
    if (!this.productId) return;

    this.stocksService.getStockItemsByProduct(this.productId).subscribe({
      next: (items) => {
        this.stockItems = items;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          'Failed to load stock information. Product details are still available.';
        this.loading = false;
        console.error('Error loading stock items:', err);
      },
    });
  }

  processProductData(): void {
    if (this.product && this.product.allergens) {
      this.displayAllergens = Array.isArray(this.product.allergens)
        ? this.product.allergens
        : this.product.allergens.split(',').map((a) => a.trim());
    }
  }

  checkUserPermissions(): void {
    const currentUser = this.authService.getCurrentUser();
    // Check if user has admin or manager role which allows product editing
    this.canEdit =
      currentUser &&
      (currentUser.role === 'admin' || currentUser.role === 'manager');
  }

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }

  editProduct(): void {
    if (this.productId) {
      this.router.navigate(['/dashboard/products/edit', this.productId]);
    }
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
