import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import {
  Product,
  ProductCategory,
  ProductUnit,
} from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  // Use the enum values for the dropdowns
  categories = Object.values(ProductCategory);
  units = Object.values(ProductUnit);

  // For allergens handling
  allergensList: string[] = [
    'Milk',
    'Eggs',
    'Fish',
    'Shellfish',
    'Tree nuts',
    'Peanuts',
    'Wheat',
    'Soybeans',
    'Sesame',
  ];
  selectedAllergens: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      unit: ['', Validators.required],
      minStock: [0, [Validators.required, Validators.min(0)]],
      trackExpiration: [true],
      nutritionInfo: [''],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProductDetails(this.productId);
    }
  }

  loadProductDetails(id: string): void {
    this.loading = true;
    this.error = null;

    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.populateForm(product);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
        console.error('Error loading product:', err);
      },
    });
  }

  populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      category: product.category,
      unit: product.unit,
      minStock: product.minStock || 0,
      trackExpiration: product.trackExpiration || false,
      nutritionInfo: product.nutritionInfo || '',
    });

    // Handle allergens array
    if (product.allergens) {
      this.selectedAllergens = Array.isArray(product.allergens)
        ? product.allergens
        : product.allergens;
    }
  }

  toggleAllergen(allergen: string): void {
    const index = this.selectedAllergens.indexOf(allergen);
    if (index === -1) {
      this.selectedAllergens.push(allergen);
    } else {
      this.selectedAllergens.splice(index, 1);
    }
  }

  isAllergenSelected(allergen: string): boolean {
    return this.selectedAllergens.includes(allergen);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.submitting = true;
    const productData = this.prepareProductData();

    if (this.isEditMode && this.productId) {
      this.updateProduct(this.productId, productData);
    } else {
      this.createProduct(productData);
    }
  }

  prepareProductData(): Product {
    const formValue = this.productForm.value;

    return {
      ...formValue,
      allergens: this.selectedAllergens,
    } as Product;
  }

  createProduct(product: Product): void {
    this.productsService.createProduct(product).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = 'Failed to create product. Please try again.';
        this.submitting = false;
        console.error('Error creating product:', err);
      },
    });
  }

  updateProduct(id: string, product: Product): void {
    this.productsService.updateProduct(id, product).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = 'Failed to update product. Please try again.';
        this.submitting = false;
        console.error('Error updating product:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
