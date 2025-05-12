import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.css'],
})
export class InspectionDetailComponent implements OnInit {
  inspectionId: string | null = null;

  loading = false;
  error: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.inspectionId = this.route.snapshot.paramMap.get('id');
    if (this.inspectionId) {
      this.loadInspectionDetails(this.inspectionId);
    } else {
      this.error = 'No inspection ID provided.';
    }
  }

  // Load a specific inspection by ID
  loadInspectionDetails(id: string): void {



  }

  // Update the status of the current inspection
  updateStatus(): void {

  }

  // Navigate back to inspection list
  goBack(): void {
    this.router.navigate(['/dashboard/inspection']);
  }

  // Format timestamp to readable string
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  // Get CSS class for inspection status
  getStatusClass() {

  }

  // Get CSS class for finding severity
  getSeverityClass() {

  }

  // Get CSS class for finding type
  getTypeClass() {

}
}
