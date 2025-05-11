import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../core/services/collecte.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-collecte-detail',
  templateUrl: './collecte-detail.component.html',
  styleUrls: ['./collecte-detail.component.css'],
})
export class CollecteDetailComponent implements OnInit {
  collecte: Collecte | null = null;
  loading = false;
  error: string | null = null;

  // Expose enum to template
  CollecteStatus = CollecteStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCollecte(id);
    } else {
      this.error = 'No collection ID provided.';
    }
  }

  loadCollecte(id: string): void {
    this.loading = true;
    this.error = null;

    this.collecteService
      .getCollecteById(id)
      .pipe(
        catchError((error) => {
          this.error = 'Failed to load collection details. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data) => {
        this.collecte = data;
      });
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  updateStatus(status: CollecteStatus): void {
    if (!this.collecte) return;

    this.loading = true;
    this.error = null;

    this.collecteService
      .updateCollecte(this.collecte._id, { status })
      .pipe(
        catchError((error) => {
          this.error = 'Failed to update collection status. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result) => {
        if (result) {
          this.collecte = result;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/collecte']);
  }
}
