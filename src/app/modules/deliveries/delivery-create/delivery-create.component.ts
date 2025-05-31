import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { DeliveryRequest, Delivery } from '../../../core/models/delivery.model';
import { AuthService } from '../../../core/services/auth.service';
import { RouteOptimizationService, Waypoint, OptimizedRoute } from '../../../core/services/route-optimization.service';

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
  optimizedRoute: OptimizedRoute | null = null;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private router: Router,
    private routeOptimizationService: RouteOptimizationService
  ) {
    this.deliveryForm = this.fb.group({
      pickupDate: ['', [Validators.required]],
      expectedDeliveryDate: [''],
      beneficiaryId: ['', [Validators.required]],
      transporterId: [''],
      pickupLocation: this.fb.group({
        lat: ['', [Validators.required]],
        lng: ['', [Validators.required]]
      }),
      deliveryLocation: this.fb.group({
        lat: ['', [Validators.required]],
        lng: ['', [Validators.required]]
      })
    });
  }

  ngOnInit(): void {
    this.deliveryForm.reset();
  }

  calculateRoute(): void {
    if (this.deliveryForm.get('pickupLocation')?.valid && this.deliveryForm.get('deliveryLocation')?.valid) {
      const pickupLocation = this.deliveryForm.get('pickupLocation')?.value;
      const deliveryLocation = this.deliveryForm.get('deliveryLocation')?.value;

      const waypoints: Waypoint[] = [
        { lat: pickupLocation.lat, lng: pickupLocation.lng },
        { lat: deliveryLocation.lat, lng: deliveryLocation.lng }
      ];

      this.routeOptimizationService.calculateOptimizedRoute(waypoints)
        .subscribe({
          next: (route) => {
            this.optimizedRoute = route;
            // You can use this route information to display on a map or show distance/duration
            console.log('Optimized route:', route);
          },
          error: (err) => {
            this.error = true;
            this.errorMessage = 'Failed to calculate route: ' + err.message;
          }
        });
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
      donorId: this.authService.getCurrentUser()?._id || 'defaultDonorId',
      beneficiaryId: this.deliveryForm.value.beneficiaryId,
      pickupDate: new Date(this.deliveryForm.value.pickupDate),
      expectedDeliveryDate: this.deliveryForm.value.expectedDeliveryDate
        ? new Date(this.deliveryForm.value.expectedDeliveryDate)
        : undefined,
      transporterId: this.deliveryForm.value.transporterId || undefined,
      pickupLocation: this.deliveryForm.value.pickupLocation,
      deliveryLocation: this.deliveryForm.value.deliveryLocation,
      routeInfo: this.optimizedRoute || undefined
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

  cancel(): void {
    this.router.navigate(['/dashboard/deliveries']);
  }

  getCompletedFields(): number {
    let completed = 0;
    const requiredFields = [
      'pickupDate',
      'beneficiaryId',
      'pickupLocation.lat',
      'pickupLocation.lng',
      'deliveryLocation.lat',
      'deliveryLocation.lng'
    ];

    requiredFields.forEach(field => {
      const control = this.deliveryForm.get(field);
      if (control && control.valid) {
        completed++;
      }
    });

    return completed;
  }
}