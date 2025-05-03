import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  productId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      // Short timeout to show the loading spinner briefly
      setTimeout(() => {
        this.router.navigate(['/dashboard/products/form', this.productId]);
      }, 1500);
    } else {
      this.router.navigate(['/dashboard/products']);
    }
  }

  onBack(): void {
    this.router.navigate(['/dashboard/products']);
  }
}
