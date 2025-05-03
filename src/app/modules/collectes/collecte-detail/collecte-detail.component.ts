import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte, CollecteStatus } from '../../../core/models/collecte.model';
import { CollecteService } from '../../../services/collecte.service';

@Component({
  selector: 'app-collecte-detail',
  templateUrl: './collecte-detail.component.html',
  styleUrls: ['./collecte-detail.component.css'],
})
export class CollecteDetailComponent implements OnInit {
  collecte: any = null;
  isLoading = true;
  error: string | null = null;
  collecteStatus = CollecteStatus;
  statusOptions = Object.values(CollecteStatus);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject('CollecteService') private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    this.loadCollecte();
  }

  loadCollecte(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid collecte ID';
      this.isLoading = false;
      return;
    }

    // Simulate API call
    setTimeout(() => {
      this.collecte = {
        _id: id,
        title: 'Collection for Food Donation',
        description: 'Collection of non-perishable food items',
        status: CollecteStatus.PENDING,
        scheduledDate: new Date(),
        location: '123 Main St, Paris',
        items: [
          { name: 'Canned Goods', quantity: 20 },
          { name: 'Rice', quantity: 10 },
        ],
        donorName: 'John Doe',
        contactPhone: '+33 123 456 789',
        contactEmail: 'john.doe@example.com',
        notes: 'Pickup between 9am and 5pm',
      };
      this.isLoading = false;
    }, 1000);
  }

  updateStatus(status: CollecteStatus): void {
    if (!this.collecte) return;

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.collecte.status = status;
      if (status === CollecteStatus.COMPLETED) {
        this.collecte.completedDate = new Date();
      }
      this.isLoading = false;
    }, 800);
  }

  assignTransporter(transporterId: string): void {
    if (!this.collecte) return;

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.collecte.transporter = {
        _id: transporterId,
        name: 'John Smith',
        phone: '+33 987 654 321',
      };
      this.collecte.status = CollecteStatus.ASSIGNED;
      this.isLoading = false;
    }, 800);
  }

  getStatusClass(status: CollecteStatus): string {
    switch (status) {
      case CollecteStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case CollecteStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case CollecteStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case CollecteStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case CollecteStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case CollecteStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
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
