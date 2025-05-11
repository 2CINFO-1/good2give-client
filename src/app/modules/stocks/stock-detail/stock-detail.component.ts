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

  loadProductDetails(productId: Product | string): void {
    // If productId is already a Product object, use it directly
    if (typeof productId === 'object' && productId !== null) {
      this.product = productId;
      this.isLoading = false;
      return;
    }

    // Otherwise fetch the product by its ID
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
      this.router.navigate(['/dashboard/stocks/edit', this.stock._id]);
    }
  }

  goToAdjust(): void {
    if (this.stock) {
      this.router.navigate(['/dashboard/stocks/adjust'], {
        queryParams: {
          productId:
            typeof this.stock.productId === 'string'
              ? this.stock.productId
              : this.stock.productId._id,
        },
      });
    }
  }

  isLowStock(): boolean {
    // Since minStock doesn't exist in the model, always return false
    return false;
  }

  confirmDelete(): void {
    if (!this.stock) return;

    if (confirm('Are you sure you want to delete this stock entry?')) {
      this.isLoading = true;
      this.stockService.deleteStock(this.stock._id).subscribe({
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

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';
    try {
      const dateObj =
        typeof date === 'string'
          ? new Date(date)
          : date instanceof Date
          ? date
          : null;
      return dateObj ? dateObj.toLocaleDateString() : 'N/A';
    } catch (error) {
      return 'Invalid Date';
    }
  }

  adjustStock(): void {
    // Navigate to stock adjustment page
    if (this.stock) {
      this.router.navigate(['/dashboard/stocks/adjust', this.stock._id]);
    }
  }

  releaseStock(): void {
    if (!this.stock || this.stock.releasedAt) {
      return;
    }

    // Set release date to current date
    const releaseDate = new Date().toISOString();

    this.stockService
      .updateStock(this.stock._id, {
        releasedAt: releaseDate,
      })
      .subscribe({
        next: () => {
          // Reload the stock details
          this.loadStockDetails();
        },
        error: (err) => {
          console.error('Error releasing stock:', err);
        },
      });
  }
}
