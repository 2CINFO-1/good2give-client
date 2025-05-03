import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scraps-list',
  templateUrl: './scraps-list.component.html',
  styleUrls: ['./scraps-list.component.css'],
})
export class ScrapsListComponent implements OnInit {
  scraps: any[] = [];
  isLoading = true;

  constructor() {}

  ngOnInit(): void {
    // Simulate loading data
    setTimeout(() => {
      this.scraps = [
        {
          id: 1,
          name: 'Scrap Item 1',
          quantity: 10,
          date: new Date(),
          status: 'Pending',
        },
        {
          id: 2,
          name: 'Scrap Item 2',
          quantity: 5,
          date: new Date(),
          status: 'Processed',
        },
        {
          id: 3,
          name: 'Scrap Item 3',
          quantity: 8,
          date: new Date(),
          status: 'Pending',
        },
      ];
      this.isLoading = false;
    }, 1000);
  }
}
