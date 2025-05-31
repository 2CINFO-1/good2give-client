import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="p-5">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <mat-icon class="text-red-600 text-lg">warning</mat-icon>
        </div>
        <h2 class="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
      </div>
      
      <p class="mt-3 text-gray-600 text-sm">
        {{ data.message }}
      </p>

      <div class="flex justify-end space-x-2 mt-6">
        <button mat-stroked-button
                class="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                (click)="onNoClick()">
          Cancel
        </button>
        <button mat-flat-button
                class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white"
                (click)="onYesClick()">
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 320px;
    }
    
    ::ng-deep .mat-dialog-container {
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 