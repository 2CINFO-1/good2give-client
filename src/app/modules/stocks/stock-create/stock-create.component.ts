import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService } from '../../../core/services/stock.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.css'],
})
export class StockCreateComponent implements OnInit {
  stockForm: FormGroup;
  products: Product[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      expiryDate: ['', Validators.required],
      batchNumber: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      this.isSubmitting = true;
      const stockData = this.stockForm.value;

      this.stockService.createStock(stockData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard/stocks']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to create stock. Please try again.';
        },
      });
    } else {
      this.stockForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/stocks']);
  }
}
