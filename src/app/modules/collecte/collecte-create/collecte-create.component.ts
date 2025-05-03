import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteService } from '../../../services/collecte.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
    @Inject('CollecteService') private collecteService: CollecteService
  ) {
    this.collecteForm = this.fb.group({
      donationId: ['', [Validators.required]],
      scheduledDate: ['', [Validators.required]],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // For a real application, you might load available donations here
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

    const collecteData = {
      donationId: this.f['donationId'].value,
      scheduledDate: this.f['scheduledDate'].value,
      notes: this.f['notes'].value,
    };

    this.collecteService
      .createCollecte({
        donation: collecteData.donationId,
        scheduledDate: collecteData.scheduledDate,
        notes: collecteData.notes,
      })
      .pipe(
        catchError((error) => {
          this.error = 'Failed to create collection. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result: any) => {
        if (result) {
          this.router.navigate(['/dashboard/collecte']);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/collecte']);
  }
}
