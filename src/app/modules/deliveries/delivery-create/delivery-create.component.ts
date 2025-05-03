import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { DeliveryRequest } from '../../../models/delivery.model';

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
      donationId: ['', [Validators.required]],
      scheduledDate: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      recipientId: ['', [Validators.required]],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // Any initialization logic
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid) {
      this.markFormGroupTouched(this.deliveryForm);
      return;
    }

    this.loading = true;
    this.error = false;

    const deliveryRequest: DeliveryRequest = {
      donation: this.deliveryForm.value.donationId,
      scheduledDate: new Date(this.deliveryForm.value.scheduledDate),
      address: this.deliveryForm.value.address,
      deliveryPersonId: this.deliveryForm.value.recipientId,
      notes: this.deliveryForm.value.notes,
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
