import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../core/services/collecte.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collecte-detail',
  templateUrl: './collecte-detail.component.html',
  styleUrls: ['./collecte-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CollecteDetailComponent implements OnInit, OnDestroy {
  collecte: Collecte | null = null;
  isLoading = true;
  error: string | null = null;
  collecteStatus = CollecteStatus;
  statusOptions = Object.values(CollecteStatus);
  private subscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.loadCollecte();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCollecte(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid collecte ID';
      this.isLoading = false;
      return;
    }

    this.subscription = this.collecteService.getCollecteById(id).subscribe({
      next: (data) => {
        this.collecte = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load collecte details. Please try again.';
        this.isLoading = false;
        console.error('Error loading collecte:', err);
      },
    });
  }

  updateStatus(status: CollecteStatus): void {
    if (!this.collecte) return;

    this.isLoading = true;
    const id = this.collecte._id;

    this.subscription = this.collecteService
      .updateCollecte(id, { status })
      .subscribe({
        next: (data) => {
          this.collecte = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to update collecte status. Please try again.';
          this.isLoading = false;
          console.error('Error updating collecte status:', err);
        },
      });
  }

  getStatusClass(status: CollecteStatus): string {
    switch (status) {
      case CollecteStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case CollecteStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case CollecteStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  goBack(): void {
    this.router.navigate(['/dashboard/collectes']);
  }
}
export const STATUS_CLASSES: Record<CollecteStatus, string> = {
  [CollecteStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [CollecteStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
  [CollecteStatus.COMPLETED]: 'bg-green-100 text-green-800',
};
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatService {
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}