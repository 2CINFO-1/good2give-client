import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../core/services/stock.service';
import { ProductService } from '../../../core/services/product.service';
import { Stock } from '../../../core/models/stock.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.css'],
})
export class StockAdjustmentComponent implements OnInit {
  adjustmentForm: FormGroup;
  products: Product[] = [];
  stocks: Stock[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  adjustmentTypes = [
    { value: 'increase', label: 'Increase' },
    { value: 'decrease', label: 'Decrease' },
  ];

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.adjustmentForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      adjustmentType: ['increase', Validators.required],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    );
  }

  onProductSelect(productId: string): void {
    if (productId) {
      this.isLoading = true;
      // Load stocks for this product
      this.stockService.getStockByProduct(productId).subscribe(
        (stocks: any[]) => {
          this.stocks = stocks;
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error loading stocks:', error);
          this.errorMessage = 'Failed to load stock information';
          this.isLoading = false;
        }
      );
    } else {
      this.stocks = [];
    }
  }

  onSubmit(): void {
    if (this.adjustmentForm.valid) {
      this.isSubmitting = true;
      const formData = this.adjustmentForm.value;

      this.stockService.adjustStock(formData).subscribe(
        (response) => {
          this.isSubmitting = false;
          // Navigate back to stocks list
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        (error) => {
          this.isSubmitting = false;
          this.errorMessage =
            'Failed to submit stock adjustment. Please try again.';
        }
      );
    } else {
      this.adjustmentForm.markAllAsTouched();
    }
  }

  getTotalQuantity(): number {
    return this.stocks.reduce((total, stock) => total + stock.quantity, 0);
  }

  getProductType(): string {
    const productId = this.adjustmentForm.get('productId')?.value;
    const product = this.products.find((p) => p._id === productId);
    return product?.productType || '';
  }

  getStockLocations(): string {
    const locations = [
      ...new Set(
        this.stocks
          .map((stock) => stock.location)
          .filter((location) => location !== undefined && location !== null)
      ),
    ];
    return locations.join(', ');
  }

  isDecreaseTooLarge(): boolean {
    if (this.adjustmentForm.get('adjustmentType')?.value !== 'decrease') {
      return false;
    }

    const quantity = this.adjustmentForm.get('quantity')?.value;
    if (!quantity || isNaN(quantity)) {
      return false;
    }

    return Number(quantity) > this.getTotalQuantity();
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
