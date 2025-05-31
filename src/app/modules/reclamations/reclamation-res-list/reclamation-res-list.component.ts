import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { ReclamationRES, ReclamationStatus } from '../../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamation-res-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 pt-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-3xl font-bold mb-4">Resolutions</h1>
          <div class="h-1 w-24 bg-primary-600 mx-auto mb-6"></div>
          <button (click)="createResolution()"
            class="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-medium transition-all duration-300 hover:scale-105">
            Create New Resolution
          </button>
        </div>

        <!-- Search and Filter Section -->
        <div class="max-w-4xl mx-auto mb-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="relative">
                  <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()"
                    placeholder="Search resolutions..."
                    class="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <span class="material-icons absolute left-3 top-2 text-gray-400">search</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="error" class="max-w-2xl mx-auto mb-8">
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p class="font-medium">Error</p>
            <p>{{ error }}</p>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading" class="flex justify-center my-12">
          <div class="p-4 rounded-full bg-primary-100 text-primary-600 w-16 h-16 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && filteredResolutions.length === 0" class="text-center my-16">
          <div class="p-4 rounded-full bg-primary-100 text-primary-600 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <span class="material-icons text-4xl">description</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No resolutions found</h3>
          <p class="text-gray-600 mb-8">Get started by creating a new resolution.</p>
          <button (click)="createResolution()"
            class="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-medium transition-all duration-300 hover:scale-105">
            Create Your First Resolution
          </button>
        </div>

        <!-- Resolutions Grid -->
        <div *ngIf="!isLoading && filteredResolutions.length > 0" 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let resolution of filteredResolutions"
            class="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div class="p-6">
              <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-800 mb-2">Resolution #{{ resolution._id }}</h2>
                <p class="text-gray-600 line-clamp-3">{{ resolution.resolnote }}</p>
              </div>

              <div class="flex items-center text-gray-500 mb-6">
                <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                  <span class="material-icons text-base">event</span>
                </div>
                <span class="font-medium">{{ resolution.date | date }}</span>
              </div>

              <div class="mb-6">
                <div class="flex items-center">
                  <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                    <span class="material-icons text-base">person</span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Person in Charge</p>
                    <p class="font-medium">{{ resolution.picid.name }}</p>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button (click)="viewResolution(resolution._id)"
                  class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium">
                  View Details
                </button>
                <button (click)="editResolution(resolution._id)"
                  class="px-3 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition-colors font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReclamationResListComponent implements OnInit {
  resolutions: ReclamationRES[] = [];
  filteredResolutions: ReclamationRES[] = [];
  isLoading = true;
  searchTerm = '';
  error: string | null = null;

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResolutions();
  }

  loadResolutions(): void {
    this.isLoading = true;
    this.reclamationService.getAllResolutions().subscribe({
      next: (data) => {
        this.resolutions = data;
        this.filteredResolutions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load resolutions. Please try again later.';
        console.error('Error loading resolutions:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredResolutions = this.resolutions;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredResolutions = this.resolutions.filter(resolution =>
      resolution._id.toLowerCase().includes(searchTermLower) ||
      resolution.resolnote.toLowerCase().includes(searchTermLower) ||
      resolution.picid.name.toLowerCase().includes(searchTermLower)
    );
  }

  createResolution(): void {
    this.router.navigate(['/dashboard/reclamations/resolutions/create']);
  }

  viewResolution(id: string): void {
    this.router.navigate(['/dashboard/reclamations/resolutions', id]);
  }

  editResolution(id: string): void {
    this.router.navigate(['/dashboard/reclamations/resolutions', id, 'edit']);
  }
} 