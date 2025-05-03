import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliveries-list',
  templateUrl: './deliveries-list.component.html',
  styleUrls: ['./deliveries-list.component.css'],
})
export class DeliveriesListComponent implements OnInit {
  deliveries: any[] = [];
  loading = true;
  error = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Make Math accessible to the template
  Math = Math;

  constructor(
    @Inject('DeliveryService') private deliveryService: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.loading = true;

    // Simulate API call with mock data
    setTimeout(() => {
      const mockDeliveries = [
        {
          _id: '1234abcd',
          deliveryPersonId: 'del456',
          status: 'pending',
          scheduledDate: new Date(),
          address: '123 Main St, Anytown, CA',
          notes: 'Deliver to back door',
          items: [
            { name: 'Food Package', quantity: 2, unit: 'boxes' },
            { name: 'Hygiene Kit', quantity: 1, unit: 'pack' },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '5678efgh',
          deliveryPersonId: 'del789',
          status: 'completed',
          scheduledDate: new Date(),
          address: '456 Oak St, Othertown, NY',
          notes: '',
          items: [
            { name: 'Winter Clothing', quantity: 3, unit: 'bags' },
            { name: 'Canned Goods', quantity: 10, unit: 'items' },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      this.deliveries = mockDeliveries;
      this.totalItems = mockDeliveries.length;
      this.loading = false;
    }, 1000);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
    }
  }

  viewDeliveryDetails(id: string): void {
    this.router.navigate(['/dashboard/deliveries', id]);
  }

  assignDelivery(id: string): void {
    this.router.navigate(['/dashboard/deliveries/assign', id]);
  }
}
