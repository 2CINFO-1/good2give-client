import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { ReclamationRES } from '../../../core/models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-resolutions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="all-resolutions-container">
      <div class="header">
        <h1>All Resolutions</h1>
        <button
          class="btn btn-secondary"
          (click)="goBackToResolve()"
          type="button"
        >
          <i class="material-icons">arrow_back</i>
          Back to Resolve
        </button>
      </div>

      <div class="filters">
        <input
          type="text"
          placeholder="Search resolutions..."
          class="search-input"
          [(ngModel)]="searchTerm"
          (keyup)="onSearch()"
        />
      </div>

      <div class="loading" *ngIf="loading">
        <p>Loading resolutions...</p>
      </div>

      <div class="no-data" *ngIf="!loading && filteredResolutions.length === 0">
        <p>No resolutions found.</p>
      </div>

      <div
        class="resolutions-grid"
        *ngIf="!loading && filteredResolutions.length > 0"
      >
        <div
          class="resolution-card"
          *ngFor="let resolution of filteredResolutions"
        >
          <div class="card-header">
            <h3>Resolution #{{ resolution._id.slice(-6) }}</h3>
            <span class="date">{{ formatDate(resolution.createdAt) }}</span>
          </div>
          <div class="card-body">
            <p><strong>Reclamation ID:</strong> {{ resolution.reclamid }}</p>
            <p>
              <strong>Resolution Note:</strong>
              {{ resolution.resolnote | slice : 0 : 100
              }}{{ resolution.resolnote.length > 100 ? '...' : '' }}
            </p>
            <p>
              <strong>Person in Charge:</strong>
              {{ getUserDisplayName(resolution.picid) }}
            </p>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-sm btn-outline"
              (click)="viewDetails(resolution._id)"
              type="button"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .all-resolutions-container {
        padding: 2rem;
        max-width: 1200px;
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

      .filters {
        margin-bottom: 2rem;
      }

      .search-input {
        width: 100%;
        max-width: 400px;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .loading,
      .no-data {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .resolutions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .resolution-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f0f0f0;
      }

      .card-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
      }

      .date {
        font-size: 0.9rem;
        color: #666;
      }

      .card-body p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .card-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
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

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background-color: #5a6268;
      }

      .btn-outline {
        background-color: transparent;
        color: #007bff;
        border: 1px solid #007bff;
      }

      .btn-outline:hover {
        background-color: #007bff;
        color: white;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }

      .material-icons {
        font-size: 1.2rem;
      }
    `,
  ],
})
export class AllResolutionsComponent implements OnInit {
  resolutions: ReclamationRES[] = [];
  filteredResolutions: ReclamationRES[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadResolutions();
  }

  loadResolutions(): void {
    this.loading = true;
    this.reclamationService.getAllResolutions().subscribe({
      next: (resolutions) => {
        this.resolutions = resolutions;
        this.filteredResolutions = resolutions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading resolutions:', error);
        this.toastr.error('Failed to load resolutions');
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredResolutions = this.resolutions;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredResolutions = this.resolutions.filter(
      (resolution) =>
        resolution.resolnote.toLowerCase().includes(term) ||
        resolution.reclamid.toLowerCase().includes(term) ||
        resolution._id.toLowerCase().includes(term)
    );
  }

  goBackToResolve(): void {
    this.router.navigate(['/dashboard/reclamation-res']);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/dashboard/reclamation-res', id]);
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getUserDisplayName(userid: any): string {
    if (typeof userid === 'string') {
      return userid;
    } else if (userid && typeof userid === 'object') {
      // If userid is a populated user object
      return userid.email || userid.username || userid._id || 'Unknown User';
    }
    return 'Unknown User';
  }
}
