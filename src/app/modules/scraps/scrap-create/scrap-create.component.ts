import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ScrapService } from '../../../core/services/scrap.service';
import { FoodScrapRequest } from '../../../core/models/scrap.model';
import { UserStateService } from '../../../core/services/user-state.service';

@Component({
  selector: 'app-scrap-create',
  templateUrl: './scrap-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ScrapCreateComponent implements OnInit {
  scrapForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private scrapService: ScrapService,
    private userStateService: UserStateService
  ) { }

  ngOnInit(): void {
    this.scrapForm = this.formBuilder.group({
      title: ['', Validators.required],
      objective: ['', Validators.required],
      location: ['', Validators.required],
      foodItems: ['', Validators.required],
      dateOfScrapping: ['', Validators.required],
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.scrapForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.scrapForm.invalid) {
      return;
    }

    this.loading = true;
    
    const currentUser = this.userStateService.getCurrentUser();
    if (!currentUser || !currentUser._id) {
      this.error = 'User information not available';
      this.loading = false;
      return;
    }

    const formValue = this.scrapForm.value;

    // Process food items from comma-separated string to array
    const foodItems = formValue.foodItems
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);

    const scrapData: FoodScrapRequest = {
      beneficiaryid: currentUser._id,
      title: formValue.title,
      objective: formValue.objective,
      location: formValue.location,
      foodItems: foodItems,
      dateOfScrapping: formValue.dateOfScrapping,
    };

    this.scrapService.createScrap(scrapData)
      .subscribe({
        next: (response) => {
          console.log('Scrap created successfully', response);
          this.router.navigate(['/dashboard/scraps']); // Navigate to scraps list after creation
        },
        error: (error) => {
          this.error = 'Failed to create scrap. Please try again.';
          this.loading = false;
          console.error('Error creating scrap:', error);
        }
      });
  }

  // Optional: Add a method to navigate back
  goBackToList(): void {
    this.router.navigate(['/dashboard/scraps']);
  }
} 