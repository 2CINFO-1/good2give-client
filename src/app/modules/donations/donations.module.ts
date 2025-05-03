import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DonationsListComponent } from './donations-list/donations-list.component';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { DonationCreateComponent } from './donation-create/donation-create.component';
import { DonationService } from '../../services/donation.service';

const routes: Routes = [
  { path: '', component: DonationsListComponent },
  { path: 'create', component: DonationCreateComponent },
  { path: ':id', component: DonationDetailComponent },
];

@NgModule({
  declarations: [
    DonationsListComponent,
    DonationDetailComponent,
    DonationCreateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [{ provide: 'DonationService', useClass: DonationService }],
})
export class DonationsModule {}
