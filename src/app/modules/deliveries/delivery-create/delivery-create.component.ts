import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { DeliveryRequest, DeliveryItem } from '../../../models/delivery.model';

@Component({
  selector: 'app-delivery-create',
  templateUrl: './delivery-create.component.html',
  styleUrls: ['./delivery-create.component.css'],
})
export class DeliveryCreateComponent implements OnInit {
  deliveryForm: FormGroup;
  loading = false;
  error = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private router: Router
  ) {
    this.deliveryForm = this.fb.group({
      scheduledDate: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      recipientId: ['', [Validators.required]],
      notes: [''],
      items: this.fb.array([this.createItem()]),
    });
  }

  ngOnInit(): void {
    // Any initialization logic
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit: ['', [Validators.required]],
    });
  }

  get items() {
    return this.deliveryForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid) {
      this.markFormGroupTouched(this.deliveryForm);
      return;
    }

    this.loading = true;
    this.error = false;

    const deliveryRequest: DeliveryRequest = {
      scheduledDate: new Date(this.deliveryForm.value.scheduledDate),
      address: this.deliveryForm.value.address,
      deliveryPersonId: this.deliveryForm.value.recipientId,
      notes: this.deliveryForm.value.notes,
      items: this.deliveryForm.value.items as DeliveryItem[],
    };

    this.deliveryService.createDelivery(deliveryRequest).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/dashboard/deliveries', data._id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage =
          err.message || 'Failed to create delivery. Please try again.';
      },
    });
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter for form controls for easier access in the template
  get f() {
    return this.deliveryForm.controls;
  }
}
