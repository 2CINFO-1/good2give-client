import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteService } from '../../../core/services/collecte.service';
import {
  Collecte,
  CollecteRequest,
  CollecteStatus,
} from '../../../core/models/collecte.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-collecte-create',
  templateUrl: './collecte-create.component.html',
  styleUrls: ['./collecte-create.component.css'],
})
export class CollecteCreateComponent implements OnInit {
  collecteForm!: FormGroup;
  loading = false;
  error: string | null = null;

  // Expose enum to template
  CollecteStatus = CollecteStatus;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.collecteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      status: [CollecteStatus.PENDING],
    });
  }

  // Getter for form controls (used in template)
  get f() {
    return this.collecteForm.controls;
  }

  onSubmit(): void {
    if (this.collecteForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const collecteRequest = this.collecteForm.value;

    this.collecteService
      .createCollecte(collecteRequest)
      .pipe(
        catchError((error) => {
          this.error = 'Failed to create collection. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigate(['/dashboard/collecte']);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collecte']);
  }
}
