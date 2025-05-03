import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scrap-create',
  templateUrl: './scrap-create.component.html',
  styleUrls: ['./scrap-create.component.css'],
})
export class ScrapCreateComponent implements OnInit {
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
    console.log('ScrapCreateComponent initialized');
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
