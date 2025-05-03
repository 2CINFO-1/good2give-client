import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Using any type to avoid TypeScript errors until the service issues are resolved
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-donation-create',
  templateUrl: './donation-create.component.html',
  styleUrls: ['./donation-create.component.css'],
})
export class DonationCreateComponent implements OnInit {
  donationForm: FormGroup;
  products: Product[] = [];
  loading = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject('DonationService') private donationService: any,
    private productService: ProductsService
  ) {
    this.donationForm = this.fb.group({
      donorName: ['', [Validators.required]],
      pickupAddress: ['', [Validators.required]],
      pickupDate: ['', [Validators.required]],
      notes: [''],
      items: this.fb.array([this.createProductFormGroup()]),
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.loading = false;
        this.error = 'Failed to load products';
      },
    });
  }

  get productsArray(): FormArray {
    return this.donationForm.get('items') as FormArray;
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      name: [''],
      quantity: [1, [Validators.required, Validators.min(0.1)]],
      productType: [''],
    });
  }

  addProduct(): void {
    this.productsArray.push(this.createProductFormGroup());
  }

  removeProduct(index: number): void {
    if (this.productsArray.length > 1) {
      this.productsArray.removeAt(index);
    }
  }

  onProductChange(index: number): void {
    const productControl = this.productsArray.at(index);
    const selectedProductId = productControl.get('productId')?.value;

    if (selectedProductId) {
      const selectedProduct = this.products.find(
        (p) => p._id === selectedProductId
      );
      if (selectedProduct) {
        productControl.patchValue({
          name: selectedProduct.name,
          productType: selectedProduct.productType,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.donationForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.donationForm);
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const donationData = {
      donorName: this.donationForm.get('donorName')?.value,
      pickupAddress: this.donationForm.get('pickupAddress')?.value,
      pickupDate: this.donationForm.get('pickupDate')?.value,
      notes: this.donationForm.get('notes')?.value,
      items: this.productsArray.value,
    };

    this.donationService.createDonation(donationData).subscribe({
      next: (response: any) => {
        this.success = 'Donation created successfully!';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/donations']);
        }, 1500);
      },
      error: (err: any) => {
        this.error = 'Failed to create donation. Please try again later.';
        console.error('Error creating donation:', err);
        this.submitting = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/donations']);
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          }
        }
      } else {
        control?.markAsTouched();
      }
    });
  }
}
