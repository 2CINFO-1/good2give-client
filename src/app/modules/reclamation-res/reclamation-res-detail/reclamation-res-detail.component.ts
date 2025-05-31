import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { ReclamationRES } from '../../../core/models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reclamation-res-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      <div class="header">
        <h1>Resolution Details</h1>
        <div class="actions">
          <button class="btn btn-secondary" (click)="goBack()" type="button">
            <i class="material-icons">arrow_back</i>
            Back
          </button>
          <button
            class="btn btn-primary"
            (click)="editResolution()"
            type="button"
            *ngIf="resolution"
          >
            <i class="material-icons">edit</i>
            Edit
          </button>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <p>Loading resolution details...</p>
      </div>

      <div class="resolution-details" *ngIf="!loading && resolution">
        <div class="detail-card">
          <h3>Resolution Information</h3>
          <div class="detail-row">
            <label>Resolution ID:</label>
            <span>{{ resolution._id }}</span>
          </div>
          <div class="detail-row">
            <label>Reclamation ID:</label>
            <span>{{ resolution.reclamid }}</span>
          </div>
          <div class="detail-row">
            <label>Resolution Note:</label>
            <span class="note">{{ resolution.resolnote }}</span>
          </div>
          <div class="detail-row">
            <label>Person in Charge:</label>
            <span
              >{{ resolution.picid.name }} {{ resolution.picid.email }}</span
            >
          </div>
          <div class="detail-row">
            <label>Created At:</label>
            <span>{{ formatDate(resolution.createdAt) }}</span>
          </div>
          <div class="detail-row" *ngIf="resolution.updatedAt">
            <label>Updated At:</label>
            <span>{{ formatDate(resolution.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="no-data" *ngIf="!loading && !resolution">
        <p>Resolution not found.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .detail-container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header h1 {
        margin: 0;
        color: #333;
      }

      .actions {
        display: flex;
        gap: 1rem;
      }

      .loading,
      .no-data {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .detail-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .detail-card h3 {
        margin: 0 0 1.5rem 0;
        color: #333;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e9ecef;
      }

      .detail-row {
        display: flex;
        margin-bottom: 1rem;
        align-items: flex-start;
      }

      .detail-row label {
        font-weight: 500;
        color: #333;
        width: 150px;
        flex-shrink: 0;
      }

      .detail-row span {
        color: #666;
        line-height: 1.4;
      }

      .detail-row span.note {
        white-space: pre-wrap;
        word-break: break-word;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background-color: #0056b3;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background-color: #5a6268;
      }

      .material-icons {
        font-size: 1.2rem;
      }
    `,
  ],
})
export class ReclamationResDetailComponent implements OnInit {
  resolution: ReclamationRES | null = null;
  loading = true;
  resolutionId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService,
    private toastr: ToastrService
  ) {
    this.resolutionId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.resolutionId) {
      this.loadResolution();
    }
  }

  loadResolution(): void {
    this.loading = true;
    this.reclamationService.getResolutionById(this.resolutionId).subscribe({
      next: (resolution) => {
        this.resolution = resolution;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading resolution:', error);
        this.toastr.error('Failed to load resolution details');
        this.loading = false;
      },
    });
  }

  editResolution(): void {
    if (this.resolution) {
      this.router.navigate([
        '/dashboard/reclamation-res',
        this.resolution._id,
        'update',
      ]);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/reclamation-res']);
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return (
      new Date(date).toLocaleDateString() +
      ' ' +
      new Date(date).toLocaleTimeString()
    );
  }
}
