import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ScrapService } from '../../../core/services/scrap.service';
import { FoodScrap, FoodScrapRequest } from '../../../core/models/scrap.model';

@Component({
  selector: 'app-scrap-edit',
  templateUrl: './scrap-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class ScrapEditComponent implements OnInit {
  scrapId: string | null = null;
  scrapForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  scrap: FoodScrap | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scrapService: ScrapService
  ) { }

  ngOnInit(): void {
    this.scrapId = this.route.snapshot.paramMap.get('id');
    console.log('Edit component initialized with ID:', this.scrapId);

    this.scrapForm = this.formBuilder.group({
      title: ['', Validators.required],
      objective: ['', Validators.required],
      location: ['', Validators.required],
      foodItems: ['', Validators.required],
      dateOfScrapping: ['', Validators.required],
    });

    if (this.scrapId) {
      this.loadScrap(this.scrapId);
    } else {
      this.error = 'Scrap ID not provided.';
    }
  }

  loadScrap(id: string): void {
    console.log('Loading scrap with ID:', id);
    this.loading = true;
    this.scrapService.getScrapById(id)
      .subscribe({
        next: (scrap) => {
          console.log('Loaded scrap data:', scrap);
          this.scrap = scrap;
          // Populate the form with scrap data
          this.scrapForm.patchValue({
            title: scrap.title,
            objective: scrap.objective,
            location: scrap.location,
            // Convert foodItems array to a comma-separated string for the form
            foodItems: scrap.foodItems.join(', '),
            // Format the date for the date input
            dateOfScrapping: scrap.dateOfScrapping ? new Date(scrap.dateOfScrapping).toISOString().split('T')[0] : '',
          });
          console.log('Form values after patch:', this.scrapForm.value);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading scrap:', error);
          this.error = 'Failed to load scrap for editing.';
          this.loading = false;
        }
      });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.scrapForm.controls; }

  onSubmit(): void {
    console.log('Form submitted');
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.scrapForm.invalid) {
      console.log('Form is invalid:', this.scrapForm.errors);
      return;
    }

    this.loading = true;
    
    if (!this.scrapId || !this.scrap) {
      console.error('Missing scrap ID or data:', { scrapId: this.scrapId, scrap: this.scrap });
      this.error = 'Scrap ID or data is missing.';
      this.loading = false;
      return;
    }

    const formValue = this.scrapForm.value;
    console.log('Form values:', formValue);

    // Process food items from comma-separated string to array
    const foodItems = formValue.foodItems
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
    console.log('Processed food items:', foodItems);

    // Get the beneficiaryid from the current scrap
    const beneficiaryid = typeof this.scrap.beneficiaryid === 'string' 
      ? this.scrap.beneficiaryid 
      : this.scrap.beneficiaryid._id;
    console.log('Beneficiary ID:', beneficiaryid);

    // Create the updated scrap data object
    const updatedScrapData: Partial<FoodScrapRequest> = {
      title: formValue.title,
      objective: formValue.objective,
      location: formValue.location,
      foodItems: foodItems,
      dateOfScrapping: formValue.dateOfScrapping,
    };
    console.log('Update data:', updatedScrapData);

    this.scrapService.updateScrap(this.scrapId, updatedScrapData)
      .subscribe({
        next: (response) => {
          console.log('Scrap updated successfully:', response);
          // Navigate back to the detail page
          this.router.navigate(['/dashboard/scraps', this.scrapId]);
        },
        error: (error) => {
          console.error('Error updating scrap:', error);
          this.error = 'Failed to update scrap. Please try again.';
          this.loading = false;
        }
      });
  }

  // Optional: Add a method to navigate back
  goBackToDetail(): void {
    if (this.scrapId) {
      this.router.navigate(['/dashboard/scraps', this.scrapId]);
    } else {
       this.router.navigate(['/dashboard/scraps']); // Go to list if ID is missing
    }
  }
} 