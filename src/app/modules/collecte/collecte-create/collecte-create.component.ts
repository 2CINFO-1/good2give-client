import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteService } from '../../../services/collecte.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  CollecteRequest,
  CollecteStatus,
  CollecteItem,
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
      scheduledDate: ['', [Validators.required]],
      notes: [''],
      items: this.fb.array([], [Validators.required]),
      status: [CollecteStatus.PENDING],
    });
  }

  ngOnInit(): void {
    // Add an initial item
    this.addItem();
  }

  get f() {
    return this.collecteForm.controls;
  }

  get itemsControls() {
    return this.collecteForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
    });
  }

  addItem(): void {
    this.itemsControls.push(this.createItem());
  }

  removeItem(index: number): void {
    this.itemsControls.removeAt(index);
  }

  onSubmit(): void {
    if (this.collecteForm.invalid) {
      // Mark all fields as touched to trigger validation
      Object.keys(this.collecteForm.controls).forEach((key) => {
        const control = this.collecteForm.get(key);
        control?.markAsTouched();
      });

      // Mark all items form fields as touched
      for (let i = 0; i < this.itemsControls.length; i++) {
        const itemGroup = this.itemsControls.at(i) as FormGroup;
        Object.keys(itemGroup.controls).forEach((key) => {
          itemGroup.get(key)?.markAsTouched();
        });
      }

      return;
    }

    this.loading = true;
    this.error = null;

    const collecteData: CollecteRequest = {
      title: this.f['title'].value,
      description: this.f['description'].value,
      location: this.f['location'].value,
      items: this.f['items'].value,
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
