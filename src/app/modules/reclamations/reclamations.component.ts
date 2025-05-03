import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Reclamation {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dateCreated: string;
  customerName: string;
}

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter = 'all';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulate API call with timeout
    setTimeout(() => {
      this.reclamations = [
        {
          _id: 'REC-2023-001',
          title: 'Defective Product',
          status: 'new',
          priority: 'high',
          dateCreated: '2023-05-15T10:30:00',
          customerName: 'John Doe',
        },
        {
          _id: 'REC-2023-002',
          title: 'Shipping Delay',
          status: 'in-progress',
          priority: 'medium',
          dateCreated: '2023-05-10T14:20:00',
          customerName: 'Jane Smith',
        },
        {
          _id: 'REC-2023-003',
          title: 'Wrong Item Received',
          status: 'resolved',
          priority: 'low',
          dateCreated: '2023-05-08T09:15:00',
          customerName: 'Michael Johnson',
        },
        {
          _id: 'REC-2023-004',
          title: 'Billing Issue',
          status: 'new',
          priority: 'high',
          dateCreated: '2023-05-14T16:45:00',
          customerName: 'Sarah Williams',
        },
        {
          _id: 'REC-2023-005',
          title: 'Discount Not Applied',
          status: 'in-progress',
          priority: 'medium',
          dateCreated: '2023-05-12T11:30:00',
          customerName: 'David Brown',
        },
      ];

      this.filteredReclamations = [...this.reclamations];
      this.isLoading = false;
    }, 1000);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReclamations = this.reclamations.filter((rec) => {
      // Apply search term filter
      const matchesSearch =
        this.searchTerm.trim() === '' ||
        rec.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rec.customerName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        rec._id.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus =
        this.statusFilter === 'all' || rec.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  viewReclamation(id: string): void {
    this.router.navigate(['/reclamations', id]);
  }

  createReclamation(): void {
    this.router.navigate(['/reclamations/create']);
  }

  filterReclamations(): void {
    if (!this.searchTerm) {
      this.filteredReclamations = this.reclamations;
      return;
    }

    this.filteredReclamations = this.reclamations.filter(
      (rec) =>
        rec._id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rec.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rec.customerName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
