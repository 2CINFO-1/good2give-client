import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';
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
    @Inject('CollecteService') private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.loadCollecte();
  }

  loadCollecte(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Collection ID is required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.collecteService
      .getCollecteById(id)
      .pipe(
        catchError((error) => {
          this.error =
            'Failed to load collection details. Please try again later.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data: Collecte | null) => {
        this.collecte = data;
        if (!data) {
          this.error = 'Collection not found';
        }
      });
  }

  updateStatus(status: CollecteStatus): void {
    if (!this.collecte) return;

    this.loading = true;
    this.error = null;

    this.collecteService
      .updateCollecteStatus(this.collecte._id, status)
      .pipe(
        catchError((error) => {
          this.error = 'Failed to update collection status. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result: Collecte | null) => {
        if (result) {
          this.collecte = result;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/collecte']);
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  getDonationId(donation: any): string {
    if (typeof donation === 'string') {
      return donation;
    } else if (donation && donation._id) {
      return donation._id;
    }
    return 'Unknown';
  }

  getTransporterId(transporter: any): string {
    if (typeof transporter === 'string') {
      return transporter;
    } else if (transporter && transporter._id) {
      return transporter._id;
    }
    return 'Unknown';
  }

  getTransporterName(transporter: any): string {
    if (typeof transporter === 'string') {
      return transporter;
    } else if (transporter && transporter.name) {
      return transporter.name;
    }
    return 'Not specified';
  }
}
