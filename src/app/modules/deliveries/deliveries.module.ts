import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DeliveriesListComponent } from './deliveries-list/deliveries-list.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { DeliveryCreateComponent } from './delivery-create/delivery-create.component';
import { DeliveryService } from '../../services/delivery.service';

const routes: Routes = [
  { path: '', component: DeliveriesListComponent },
  { path: 'create', component: DeliveryCreateComponent },
  { path: ':id', component: DeliveryDetailComponent },
];

@NgModule({
  declarations: [
    DeliveriesListComponent,
    DeliveryDetailComponent,
    DeliveryCreateComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
  providers: [DeliveryService],
})
export class DeliveriesModule {}
