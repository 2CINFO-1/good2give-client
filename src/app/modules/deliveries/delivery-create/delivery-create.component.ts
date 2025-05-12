import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { DeliveryRequest, Delivery } from '../../../core/models/delivery.model';
import { AuthService } from '../../../core/services/auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {
    this.deliveryForm = this.fb.group({
      pickupDate: ['', [Validators.required]],
      expectedDeliveryDate: [''],
      beneficiaryId: ['', [Validators.required]],
      transporterId: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.deliveryForm.invalid) {
      this.markFormGroupTouched(this.deliveryForm);
      return;
    }

    this.loading = true;
    this.error = false;

    const deliveryRequest: DeliveryRequest = {
      donorId: this.authService.getCurrentUser()?._id || 'defaultDonorId', // Get from auth
      beneficiaryId: this.deliveryForm.value.beneficiaryId,
      pickupDate: new Date(this.deliveryForm.value.pickupDate),
      expectedDeliveryDate: this.deliveryForm.value.expectedDeliveryDate
        ? new Date(this.deliveryForm.value.expectedDeliveryDate)
        : undefined,
      transporterId: this.deliveryForm.value.transporterId || undefined,
    };

    this.deliveryService.createDelivery(deliveryRequest).subscribe({
      next: (data: Delivery) => {
        this.loading = false;
        this.router.navigate(['/dashboard/deliveries', data._id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = err.message || 'Failed to create delivery.';
      },
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() {
    return this.deliveryForm.controls;
  }
}