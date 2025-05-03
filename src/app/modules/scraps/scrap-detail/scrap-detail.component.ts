import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scrap-detail',
  templateUrl: './scrap-detail.component.html',
  styleUrls: ['./scrap-detail.component.css'],
})
export class ScrapDetailComponent implements OnInit {
  scrapId: number;
  scrap: any;
  isLoading = true;

  constructor(private route: ActivatedRoute) {
    this.scrapId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    // Simulate API call
    setTimeout(() => {
      this.scrap = {
        id: this.scrapId,
        name: `Scrap Item ${this.scrapId}`,
        description: 'Detailed description of the scrap item.',
        quantity: 10,
        date: new Date(),
        status: 'Pending',
        location: 'Warehouse A',
        notes: 'Additional notes about this scrap item.',
      };
      this.isLoading = false;
    }, 1000);
  }
}
