import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { first } from 'rxjs/operators';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId: string | null = null;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  categories: string[] = ['Medicine', 'Equipment', 'Consumable', 'Other'];
  productTypes: string[] = [
    'Tablet',
    'Liquid',
    'Capsule',
    'Injection',
    'Cream',
    'Equipment',
    'Other',
  ];
  statusOptions: string[] = ['Active', 'Inactive'];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProductDetails();
    }
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
    });
  }

  loadProductDetails(): void {
    if (!this.productId) return;

    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          category: product.category,
          productType: product.productType,
          status: product.status,
        });
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load product details.';
        this.loading = false;
        console.error('Error loading product:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;
    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService
        .updateProduct(this.productId, productData)
        .pipe(first())
        .subscribe({
          next: () => {
            this.successMessage = 'Product updated successfully!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/dashboard/products']);
            }, 1500);
          },
          error: (err: any) => {
            this.error = 'Failed to update product.';
            this.loading = false;
            console.error('Error updating product:', err);
          },
        });
    } else {
      this.productService
        .createProduct(productData)
        .pipe(first())
        .subscribe({
          next: () => {
            this.successMessage = 'Product created successfully!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/dashboard/products']);
            }, 1500);
          },
          error: (err: any) => {
            this.error = 'Failed to create product.';
            this.loading = false;
            console.error('Error creating product:', err);
          },
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/products']);
  }

  deleteProduct(): void {
    if (!this.productId) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/dashboard/products']);
          }, 1500);
        },
        error: (err: any) => {
          this.error = 'Failed to delete product.';
          this.loading = false;
          console.error('Error deleting product:', err);
        },
      });
    }
  }
}
