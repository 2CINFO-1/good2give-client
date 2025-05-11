import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  isLoading = true;
  error: string | null = null;

  constructor(private scrapService: ScrapService) {}

  ngOnInit(): void {
    this.loadScraps();
  }

  loadScraps(): void {
    this.isLoading = true;
    this.scrapService.getAllScraps().subscribe({
      next: (data) => {
        this.scraps = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load scraps. Please try again later.';
        this.isLoading = false;
        console.error('Error loading scraps:', err);
      },
    });
  }
}
