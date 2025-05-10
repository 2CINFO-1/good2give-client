import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Collecte,
  CollecteStatus,
  TransporterAssignment,
} from '../../../models/collecte.model';
import { User } from '../../../models/user.model';
import { CollecteService } from '../../../services/collecte.service';
import { UserService } from '../../../services/user.service';

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
    private router: Router,
    private collecteService: CollecteService,
    private userService: UserService
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

    // Load collecte details
    this.collecteService.getCollecteById(this.collecteId).subscribe({
      next: (data) => {
        this.collecte = data;
        this.loadTransporters();
      },
      error: (err) => {
        console.error('Error loading collecte:', err);
        this.error = true;
        this.errorMessage =
          'Failed to load collection details. Please try again.';
        this.loading = false;
      },
    });
  }

  loadTransporters(): void {
    // Load available transporters
    this.userService.getTransporters().subscribe({
      next: (transporters) => {
        this.transporters = transporters;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transporters:', err);
        this.error = true;
        this.errorMessage = 'Failed to load transporters. Please try again.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid) {
      this.markFormGroupTouched(this.assignForm);
      return;
    }

    this.submitting = true;
    this.error = false;

    const assignment: TransporterAssignment = {
      collecteId: this.collecteId as string,
      transporterId: this.assignForm.value.transporterId,
    };

    this.collecteService.assignTransporter(assignment).subscribe({
      next: () => {
        // Navigate back to the detail page
        this.router.navigate(['/dashboard/collectes', this.collecteId]);
      },
      error: (err) => {
        console.error('Error assigning transporter:', err);
        this.error = true;
        this.errorMessage = 'Failed to assign transporter. Please try again.';
        this.submitting = false;
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

  goBack(): void {
    this.router.navigate(['/dashboard/collectes', this.collecteId]);
  }

  // Getter for form controls for easier access in the template
  get f() {
    return this.assignForm.controls;
  }
}
