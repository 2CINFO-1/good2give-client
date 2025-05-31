import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ScrapService } from '../../../../core/services/scrap.service';
import { FoodScrapRequest } from '../../../../core/models/scrap.model';
import { UserStateService } from '../../../../core/services/user-state.service';

@Component({
  selector: 'app-scrap-create-new',
  templateUrl: './scrap-create-new.component.html',
  styleUrls: ['./scrap-create-new.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ScrapCreateNewComponent implements OnInit {
  scrapForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private scrapService: ScrapService,
    private userStateService: UserStateService
  ) {
    this.scrapForm = this.fb.group({
      title: ['', Validators.required],
      objective: ['', Validators.required],
      location: ['', Validators.required],
      foodItems: ['', Validators.required],
      dateOfScrapping: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Initialize component
  }

  onSubmit(): void {
    if (this.scrapForm.valid) {
      this.isSubmitting = true;

      const currentUser = this.userStateService.getCurrentUser();
      if (!currentUser || !currentUser._id) {
        this.error = 'User information not available';
        this.isSubmitting = false;
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

      this.scrapService.createScrap(scrapData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard/scraps']);
        },
        error: (err) => {
          this.error = 'Failed to create scrap. Please try again.';
          this.isSubmitting = false;
          console.error('Error creating scrap:', err);
        },
      });
    } else {
      // Mark all fields as touched to trigger validation display
      this.scrapForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/scraps']);
  }
}
