import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { ReclamationRES } from '../../../core/models/reclamation.model';

@Component({
  selector: 'app-reclamation-res-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 pt-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <button (click)="router.navigate(['/dashboard/reclamations/resolutions'])" 
            class="flex items-center text-primary-600 hover:text-primary-800 transition-colors mx-auto mb-6">
            <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Resolutions
          </button>
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

        <!-- Resolution Details -->
        <div *ngIf="!isLoading && resolution" class="max-w-4xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-8">
              <!-- Title Section -->
              <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-4">Resolution #{{ resolution._id }}</h1>
                <div class="h-1 w-24 bg-primary-600 mx-auto"></div>
              </div>

              <div class="mb-8">
                <p class="text-gray-700 text-lg leading-relaxed">{{ resolution.resolnote }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-gray-50 rounded-lg p-6">
                  <h2 class="text-xl font-bold text-gray-800 mb-6">Resolution Details</h2>
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <span class="material-icons text-base">event</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Date</p>
                        <p class="font-medium">{{ resolution.date | date }}</p>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <span class="material-icons text-base">person</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Person in Charge</p>
                        <p class="font-medium">{{ resolution.picid.name }}</p>
                        <p class="text-sm text-gray-500">{{ resolution.picid.email }}</p>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <span class="material-icons text-base">description</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Reclamation ID</p>
                        <p class="font-medium">{{ resolution.reclamid }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-6">
                  <h2 class="text-xl font-bold text-gray-800 mb-6">Additional Information</h2>
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <span class="material-icons text-base">schedule</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Created At</p>
                        <p class="font-medium">{{ resolution.createdAt | date }}</p>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <span class="material-icons text-base">update</span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Last Updated</p>
                        <p class="font-medium">{{ resolution.updatedAt | date }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-4 mt-8">
                <button (click)="editResolution()"
                  class="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all duration-300 font-medium flex items-center">
                  <span class="material-icons mr-2">edit</span>
                  Edit Resolution
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
export class ReclamationResDetailComponent implements OnInit {
  resolutionId!: string;
  resolution: ReclamationRES | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.resolutionId = this.route.snapshot.paramMap.get('id') || '';
    if (this.resolutionId) {
      this.loadResolution();
    } else {
      this.error = 'Invalid resolution ID';
      this.isLoading = false;
    }
  }

  loadResolution(): void {
    this.reclamationService.getResolutionById(this.resolutionId).subscribe({
      next: (data) => {
        this.resolution = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load resolution details.';
        console.error('Error loading resolution:', err);
        this.isLoading = false;
      }
    });
  }

  editResolution(): void {
    this.router.navigate(['/dashboard/reclamations/resolutions', this.resolutionId, 'edit']);
  }
} 