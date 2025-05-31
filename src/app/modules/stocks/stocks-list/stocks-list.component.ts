import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from '../../../core/services/stock.service';
import { ProductService } from '../../../core/services/product.service';
import { Stock } from '../../../core/models/stock.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-stocks-list',
  templateUrl: './stocks-list.component.html',
  styleUrls: ['./stocks-list.component.css'],
})
export class StocksListComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  products: Record<string, Product> = {};
  isLoading = true;
  errorMessage = '';
  searchTerm = '';

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.isLoading = true;
    this.stockService.getStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        this.filteredStocks = [...this.stocks];
        this.loadProducts();
      },
      error: (error) => {
        console.error('Failed to load stocks', error);
        this.errorMessage = 'Failed to load stocks. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadProducts(): void {
    // Get unique product IDs
    const productIds = [
      ...new Set(
        this.stocks.map((stock) => {
          return typeof stock.productId === 'string'
            ? stock.productId
            : stock.productId._id;
        })
      ),
    ];

    // Create a map of product data for quick lookup
    productIds.forEach((id) =>
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.products[id] = product;
        },
        error: (error) => {
          console.error(`Failed to load product ${id}`, error);
        },
      })
    );

    // When all products are loaded, stop loading state
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  getProductName(productId: Product | string): string {
    if (typeof productId === 'object' && productId !== null) {
      return productId.name || 'Unknown Product';
    }
    return this.products[productId]?.name || 'Unknown Product';
  }

  getProductType(productId: Product | string): string {
    if (typeof productId === 'object' && productId !== null) {
      return productId.productType || '';
    }
    return this.products[productId]?.productType || '';
  }

  // Method to apply filters based on search term
  applyFilters(): void {
    this.filterStocks();
  }

  filterStocks(): void {
    this.filteredStocks = this.stocks.filter((stock) => {
      if (!this.searchTerm) return true;

      const productName = this.getProductName(stock.productId).toLowerCase();
      const donatorId =stock.donatorId._id


      return (
        productName.includes(this.searchTerm.toLowerCase()) ||
        donatorId.includes(this.searchTerm.toLowerCase())
      );
    });
  }

  viewStockDetails(stockId: string): void {
    this.router.navigate(['/dashboard/stocks/detail', stockId]);
  }

  createStock(): void {
    this.router.navigate(['/dashboard/stocks/create']);
  }

  // Update to accept stockId parameter
  adjustStock(stockId?: string): void {
    if (stockId) {
      this.router.navigate(['/dashboard/stocks/adjustment', stockId]);
    } else {
      this.router.navigate(['/dashboard/stocks/adjustment']);
    }
  }

  formatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) return '-';
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  }
}
