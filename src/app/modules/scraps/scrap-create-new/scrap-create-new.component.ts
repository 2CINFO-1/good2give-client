import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scrap-create-new',
  templateUrl: './scrap-create-new.component.html',
  styleUrls: ['./scrap-create-new.component.css'],
})
export class ScrapCreateNewComponent implements OnInit {
  scrapForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.scrapForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // Initialize component
    console.log('ScrapCreateNewComponent initialized');
  }

  onSubmit(): void {
    if (this.scrapForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/scraps']);
      }, 1000);
    } else {
      // Mark all fields as touched to trigger validation display
      this.scrapForm.markAllAsTouched();
    }
  }
}
