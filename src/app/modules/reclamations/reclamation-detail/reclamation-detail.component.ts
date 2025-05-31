import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import {
  Reclamation,
  ReclamationRES,
  ReclamationStatus,
} from '../../../core/models/reclamation.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reclamation-detail',
  templateUrl: './reclamation-detail.component.html',
  styleUrls: ['./reclamation-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ReclamationDetailComponent implements OnInit, OnDestroy {
  reclamationId!: string;
  reclamation: Reclamation | null = null;
  resolutions: ReclamationRES[] = [];
  isLoading = true;
  error: string | null = null;
  ReclamationStatus = ReclamationStatus;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.reclamationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.reclamationId) {
      this.loadReclamationData();
    } else {
      this.error = 'Invalid reclamation ID';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadReclamationData(): void {
    this.isLoading = true;

    // Load reclamation details
    const recSub = this.reclamationService
      .getReclamationById(this.reclamationId)
      .subscribe({
        next: (data: Reclamation) => {
          this.reclamation = data;
          this.loadResolutions();
        },
        error: (err: any) => {
          this.error = 'Failed to load reclamation details.';
          this.isLoading = false;
          console.error('Error loading reclamation:', err);
        },
      });

    this.subscriptions.push(recSub);
  }

  loadResolutions(): void {
    // Load reclamation resolutions
    const resSub = this.reclamationService
      .getResolutionsForReclamation(this.reclamationId)
      .subscribe({
        next: (data: ReclamationRES[]) => {
          this.resolutions = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading resolutions:', err);
          this.isLoading = false;
        },
      });

    this.subscriptions.push(resSub);
  }

  formatStatusLabel(status: ReclamationStatus): string {
    switch (status) {
      case ReclamationStatus.PENDING:
        return 'Pending';
      case ReclamationStatus.RESOLVED:
        return 'Resolved';
      case ReclamationStatus.CLOSED:
        return 'Closed';
      default:
        // Convert the status to string, capitalize first letter
        const statusStr = String(status);
        return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    }
  }

  onUpdate(): void {
    this.router.navigate([
      '/dashboard/reclamations',
      this.reclamationId,
      'update',
    ]);
  }
}
