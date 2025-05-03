import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteService } from '../../../services/collecte.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  CollecteRequest,
  CollecteStatus,
} from '../../../models/collecte.model';

@Component({
  selector: 'app-collecte-create',
  templateUrl: './collecte-create.component.html',
  styleUrls: ['./collecte-create.component.css'],
})
export class CollecteCreateComponent implements OnInit {
  collecteForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private collecteService: CollecteService
  ) {
    this.collecteForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      status: [CollecteStatus.PENDING],
    });
  }

  ngOnInit(): void {
    // Initialize component
  }

  get f() {
    return this.collecteForm.controls;
  }

  onSubmit(): void {
    if (this.collecteForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const collecteData: CollecteRequest = {
      title: this.f['title'].value,
      description: this.f['description'].value,
      location: this.f['location'].value,
      status: this.f['status'].value,
    };

    this.collecteService
      .createCollecte(collecteData)
      .pipe(
        catchError((error) => {
          this.error = 'Failed to create collection. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/dashboard/collecte']);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collecte']);
  }
}
