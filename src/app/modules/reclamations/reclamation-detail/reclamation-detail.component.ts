import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

interface Reclamation {
  id: string;
  title: string;
  description: string;
  productId: string;
  status: string;
  priority: string;
  dateCreated: string;
  lastUpdated: string;
  customerName: string;
  customerEmail: string;
  comments: Comment[];
}

@Component({
  selector: 'app-reclamation-detail',
  templateUrl: './reclamation-detail.component.html',
  styleUrls: ['./reclamation-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ReclamationDetailComponent implements OnInit {
  reclamationId!: string;
  reclamation!: Reclamation;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.reclamationId = this.route.snapshot.paramMap.get('id') || '';

    // Simulate API call with timeout
    setTimeout(() => {
      this.reclamation = {
        id: this.reclamationId,
        title: 'Defective Product',
        description:
          'I received a damaged product. The packaging was intact but the product inside was broken. I would like a replacement or refund.',
        productId: 'PROD-12345',
        status: 'in-progress',
        priority: 'high',
        dateCreated: '2023-05-15T10:30:00',
        lastUpdated: '2023-05-16T14:20:00',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        comments: [
          {
            id: 'COM-001',
            text: 'We apologize for the inconvenience. We are looking into this issue and will get back to you shortly.',
            author: 'Support Agent',
            date: '2023-05-15T14:45:00',
          },
          {
            id: 'COM-002',
            text: 'We have located a replacement product and will ship it out immediately. You should receive it within 3-5 business days.',
            author: 'Support Manager',
            date: '2023-05-16T11:30:00',
          },
        ],
      };
      this.isLoading = false;
    }, 1000);
  }

  onUpdate(): void {
    this.router.navigate(['/reclamations', this.reclamationId, 'update']);
  }
}
