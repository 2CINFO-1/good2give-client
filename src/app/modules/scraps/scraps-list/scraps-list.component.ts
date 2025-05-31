import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrapService } from '../../../core/services/scrap.service';
import { FoodScrap } from '../../../core/models/scrap.model';

@Component({
  selector: 'app-scraps-list',
  templateUrl: './scraps-list.component.html',
  styleUrls: ['./scraps-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ScrapsListComponent implements OnInit {
  scraps: FoodScrap[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private scrapService: ScrapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadScraps();
  }

  loadScraps(): void {
    this.loading = true;
    this.error = null;

    this.scrapService.getAllScraps().subscribe({
      next: (scraps) => {
        console.log('Loaded scraps:', scraps);
        this.scraps = scraps;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading scraps:', err);
        this.error = 'Failed to load scraps. Please try again later.';
        this.loading = false;
      }
    });
  }

  createScrap(): void {
    this.router.navigate(['/dashboard/scraps/create']);
  }

  goToScrapDetail(id: string): void {
    this.router.navigate(['/dashboard/scraps', id]);
  }

  editScrap(id: string): void {
    console.log('Navigating to edit scrap:', id);
    this.router.navigate(['/dashboard/scraps', id, 'edit']);
  }

  deleteScrap(id: string): void {
    console.log('Attempting to delete scrap:', id);
    if (confirm('Are you sure you want to delete this scrap?')) {
      this.scrapService.deleteScrap(id).subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          // Remove the deleted scrap from the list
          this.scraps = this.scraps.filter(scrap => scrap._id !== id);
        },
        error: (err) => {
          console.error('Error deleting scrap:', err);
          this.error = 'Failed to delete scrap. Please try again later.';
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}
