import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ScrapService } from '../../../core/services/scrap.service';
import { FoodScrap } from '../../../core/models/scrap.model';

@Component({
  selector: 'app-scrap-detail',
  templateUrl: './scrap-detail.component.html',
  styleUrls: ['./scrap-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ScrapDetailComponent implements OnInit {
  scrapId: string;
  scrap: FoodScrap | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scrapService: ScrapService
  ) {
    this.scrapId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadScrapDetails();
  }

  loadScrapDetails(): void {
    if (!this.scrapId) {
      this.error = 'Invalid scrap ID';
      this.isLoading = false;
      return;
    }

    this.scrapService.getScrapById(this.scrapId).subscribe({
      next: (data) => {
        this.scrap = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load scrap details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading scrap details:', err);
      },
    });
  }

  goBackToList(): void {
    this.router.navigate(['/dashboard/scraps']);
  }

  goToEditScrap(): void {
    if (this.scrapId) {
      this.router.navigate(['/dashboard/scraps', this.scrapId, 'edit']);
    }
  }

  deleteScrap(): void {
    if (this.scrapId) {
      if (confirm('Are you sure you want to delete this scrap?')) {
        this.scrapService.deleteScrap(this.scrapId).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/scraps']);
          },
          error: (err) => {
            this.error = 'Failed to delete scrap. Please try again later.';
            console.error('Error deleting scrap:', err);
          }
        });
      }
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}
