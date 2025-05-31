import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Checklist, ChecklistItem } from 'src/app/core/models/inspection.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChecklistService } from '../checklist.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inspection-checklist',
  templateUrl: './inspection-checklist.component.html',
  styleUrls: ['./inspection-checklist.component.css']
})
export class InspectionChecklistComponent implements OnInit {
  @Input() checklist!: Checklist;
  @Input() isEditable: boolean = true;
  @Input() loading: boolean = false;
  @Output() checklistChange = new EventEmitter<Checklist>();
  @Output() itemChecked = new EventEmitter<{ index: number, item: ChecklistItem }>();

  inspectionId: string = '';
  isStandalone: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private checklistService: ChecklistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inspectionId = id;
      this.isStandalone = true;
      this.loading = true;
      this.loadChecklist();
    } else if (!this.checklist) {
      console.error('No checklist provided to component');
    }
  }

  loadChecklist(): void {
    if (!this.inspectionId) return;

    this.checklistService.getByInspectionReport(this.inspectionId).subscribe({
      next: (checklist) => {
        this.checklist = checklist;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading checklist:', error);
        this.loading = false;
        this.snackBar.open('Error loading checklist', 'Close', { duration: 3000 });
      }
    });
  }

  onCheckboxChange(item: ChecklistItem): void {
    if (!this.isEditable) {
      this.snackBar.open('This checklist cannot be modified', 'Close', { duration: 3000 });
      return;
    }

    // If unchecking, reset passed status
    if (!item.checked) {
      item.passed = null;
    }
  }

  onPassFailChange(item: ChecklistItem, value: any): void {
    if (!this.isEditable) {
      this.snackBar.open('This checklist cannot be modified', 'Close', { duration: 3000 });
      return;
    }

    // Ensure the value is a boolean
    const passed = value === true || value === 'true';
    item.checked = true;
    item.passed = passed;
  }

  submitChecklist(): void {
    if (!this.checklist) return;

    // Validate that all required items are checked and have pass/fail status
    const incompleteRequiredItems = this.checklist.items.filter(
      item => item.required && (!item.checked || item.passed === null)
    );

    if (incompleteRequiredItems.length > 0) {
      this.snackBar.open(
        'Please complete all required items before submitting',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    this.loading = true;
    this.checklistService.update(this.checklist._id, { items: this.checklist.items }).subscribe({
      next: (updatedChecklist) => {
        this.checklist = updatedChecklist;
        this.loading = false;
        this.snackBar.open('Checklist updated successfully', 'Close', { duration: 2000 });
        if (this.isStandalone) {
          this.goBack();
        }
      },
      error: (error) => {
        console.error('Error updating checklist:', error);
        this.loading = false;
        this.snackBar.open('Error updating checklist', 'Close', { duration: 3000 });
      }
    });
  }

  getProgressPercentage(): number {
    if (!this.checklist?.items?.length) return 0;
    const checkedItems = this.checklist.items.filter(item => item.checked && item.passed !== null).length;
    return (checkedItems / this.checklist.items.length) * 100;
  }

  isChecklistComplete(): boolean {
    if (!this.checklist?.items) return false;
    return this.checklist.items.every(item => !item.required || (item.checked && item.passed !== null));
  }

  getItemStatusClass(item: ChecklistItem): string {
    if (!item.checked) return '';
    return item.passed ? 'text-green-500' : 'text-red-500';
  }

  goBack(): void {
    this.location.back();
  }

  getRequiredItemsCount(): number {
    if (!this.checklist?.items) return 0;
    return this.checklist.items.filter(item => item.required).length;
  }
} 