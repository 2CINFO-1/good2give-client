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
  products: { [key: string]: Product } = {};
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  locationFilter = '';

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
        this.errorMessage = 'Failed to load stocks. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadProducts(): void {
    // Get unique product IDs
    const productIds = [
      ...new Set(this.stocks.map((stock) => stock.productId)),
    ];

    // Create a map of product data for quick lookup
    const productRequests = productIds.map((id) =>
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

  getProductName(productId: string): string {
    return this.products[productId]?.name || 'Unknown Product';
  }

  getProductUnit(productId: string): string {
    return this.products[productId]?.unit || '';
  }

  filterStocks(): void {
    this.filteredStocks = this.stocks.filter((stock) => {
      const matchesSearch =
        !this.searchTerm ||
        this.getProductName(stock.productId)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        stock.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stock.batchNumber
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesLocation =
        !this.locationFilter ||
        stock.location.toLowerCase() === this.locationFilter.toLowerCase();

      return matchesSearch && matchesLocation;
    });
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.stocks.map((stock) => stock.location))];
  }

  viewStockDetails(stockId: string): void {
    this.router.navigate(['/dashboard/stocks/detail', stockId]);
  }

  createStock(): void {
    this.router.navigate(['/dashboard/stocks/create']);
  }

  adjustStock(): void {
    this.router.navigate(['/dashboard/stocks/adjustment']);
  }

  isLowStock(stock: Stock): boolean {
    const product = this.products[stock.productId];
    if (!product || !product.minStock) return false;
    return stock.quantity <= product.minStock;
  }

  isExpiringSoon(stock: Stock): boolean {
    if (!stock.expiryDate) return false;

    const expiryDate = new Date(stock.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterStocks();
  }

  onLocationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.locationFilter = select.value;
    this.filterStocks();
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
