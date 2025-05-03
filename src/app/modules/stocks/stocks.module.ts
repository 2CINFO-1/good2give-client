/**
 * StocksModule - Manages stock inventory and related operations
 */
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Import all components explicitly
import { StocksListComponent } from './stocks-list/stocks-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { StockCreateComponent } from './stock-create/stock-create.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';

// Define routes
const routes: Routes = [
  { path: '', component: StocksListComponent },
  { path: 'create', component: StockCreateComponent },
  { path: 'detail/:id', component: StockDetailComponent },
  { path: 'adjust', component: StockAdjustmentComponent },
];

@NgModule({
  declarations: [
    StocksListComponent,
    StockDetailComponent,
    StockCreateComponent,
    StockAdjustmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [DatePipe],
})
export class StocksModule {
  constructor() {
    console.log('StocksModule loaded successfully');
  }
}
