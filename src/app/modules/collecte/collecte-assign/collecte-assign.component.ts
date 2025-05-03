import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-collecte-assign',
  templateUrl: './collecte-assign.component.html',
  styleUrls: ['./collecte-assign.component.css'],
})
export class CollecteAssignComponent implements OnInit {
  collecteId: string | null = null;
  collecte: Collecte | null = null;
  transporters: User[] = [];
  assignForm: FormGroup;
  loading = true;
  submitting = false;
  error = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.assignForm = this.fb.group({
      transporterId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.collecteId = this.route.snapshot.paramMap.get('id');
    if (this.collecteId) {
      this.loadCollecteAndTransporters();
    } else {
      this.error = true;
      this.errorMessage = 'Collection ID is missing';
      this.loading = false;
    }
  }

  loadCollecteAndTransporters(): void {
    if (!this.collecteId) return;

    this.loading = true;
    this.error = false;

    // Simulate API call to load collecte
    setTimeout(() => {
      this.collecte = {
        _id: this.collecteId || '',
        donation: {
          _id: 'don123',
          title: 'Food Donation',
          description: 'Donation of non-perishable foods',
        } as any,
        status: CollecteStatus.PENDING,
        scheduledDate: new Date(),
        notes: 'Sample notes for collection',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate loading transporters with proper User structure
      this.transporters = [
        {
          _id: 'trans1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: UserRole.TRANSPORTER,
          // Add these properties for the template to work
          firstName: 'John',
          lastName: 'Doe',
        } as unknown as User,
        {
          _id: 'trans2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: UserRole.TRANSPORTER,
          // Add these properties for the template to work
          firstName: 'Jane',
          lastName: 'Smith',
        } as unknown as User,
      ];

      this.loading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.assignForm.invalid) {
      this.markFormGroupTouched(this.assignForm);
      return;
    }

    this.submitting = true;
    this.error = false;

    // Simulate API call
    setTimeout(() => {
      const transporterId = this.assignForm.value.transporterId;
      const transporter = this.transporters.find(
        (t) => t._id === transporterId
      );

      if (this.collecte && transporter) {
        this.collecte.transporter = transporter;
        this.collecte.status = CollecteStatus.ASSIGNED;
        this.collecte.updatedAt = new Date();

        // Navigate back to the detail page
        this.router.navigate(['/dashboard/collecte', this.collecteId]);
      } else {
        this.error = true;
        this.errorMessage = 'Failed to assign transporter. Please try again.';
        this.submitting = false;
      }
    }, 800);
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

  goBack(): void {
    this.router.navigate(['/dashboard/collecte', this.collecteId]);
  }

  // Getter for form controls for easier access in the template
  get f() {
    return this.assignForm.controls;
  }
}
