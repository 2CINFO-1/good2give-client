import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../core/services/stock.service';
import { ProductService } from '../../../core/services/product.service';
import { Stock } from '../../../core/models/stock.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css'],
})
export class StockDetailComponent implements OnInit {
  stock: Stock | null = null;
  product: Product | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStockDetails();
  }

  loadStockDetails(): void {
    const stockId = this.route.snapshot.paramMap.get('id');
    if (!stockId) {
      this.errorMessage = 'Stock ID not found';
      this.isLoading = false;
      return;
    }

    this.stockService.getStockById(stockId).subscribe({
      next: (data) => {
        this.stock = data;
        if (this.stock.productId) {
          this.loadProductDetails(this.stock.productId);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load stock details. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadProductDetails(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load product details. Please try again.';
        this.isLoading = false;
      },
    });
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/stocks']);
  }

  goToEdit(): void {
    if (this.stock) {
      this.router.navigate(['/dashboard/stocks/edit', this.stock.id]);
    }
  }

  goToAdjust(): void {
    if (this.stock) {
      this.router.navigate(['/dashboard/stocks/adjust'], {
        queryParams: { productId: this.stock.productId },
      });
    }
  }

  isLowStock(): boolean {
    if (!this.stock || !this.product || !this.product.minStock) {
      return false;
    }
    return this.stock.quantity <= this.product.minStock;
  }

  isExpiringSoon(): boolean {
    if (!this.stock || !this.stock.expiryDate) {
      return false;
    }

    const expiryDate = new Date(this.stock.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  }

  confirmDelete(): void {
    if (!this.stock) return;

    if (confirm('Are you sure you want to delete this stock entry?')) {
      this.isLoading = true;
      this.stockService.deleteStock(this.stock.id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/stocks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete stock. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
