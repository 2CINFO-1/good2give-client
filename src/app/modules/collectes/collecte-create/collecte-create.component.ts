import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';

@Component({
  selector: 'app-collecte-create',
  templateUrl: './collecte-create.component.html',
  styleUrls: ['./collecte-create.component.css'],
})
export class CollecteCreateComponent implements OnInit {
  collecteForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  donations: any[] = [];
  transporters: any[] = [];
  isLoadingDonations = false;
  isLoadingTransporters = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject('CollecteService') private collecteService: CollecteService
  ) {
    this.collecteForm = this.fb.group({
      donationId: ['', Validators.required],
      transporterId: [''],
      scheduledDate: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    // Simulate loading donations data
    this.isLoadingDonations = true;
    setTimeout(() => {
      this.donations = [
        {
          _id: 'don1',
          title: 'Food Donation',
          location: 'Paris',
          status: 'approved',
        },
        {
          _id: 'don2',
          title: 'Clothing Donation',
          location: 'Lyon',
          status: 'approved',
        },
      ];
      this.isLoadingDonations = false;
    }, 800);

    // Simulate loading transporters data
    this.isLoadingTransporters = true;
    setTimeout(() => {
      this.transporters = [
        {
          _id: 'trans1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        {
          _id: 'trans2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        },
      ];
      this.isLoadingTransporters = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.collecteForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.collecteForm.value;

    // Convert date string to Date object if needed
    if (typeof formValue.scheduledDate === 'string') {
      formValue.scheduledDate = new Date(formValue.scheduledDate);
    }

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/collectes']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collectes']);
  }

  get formControls() {
    return this.collecteForm.controls;
  }
}
