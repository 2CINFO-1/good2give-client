import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';
import { InspectionCreateComponent } from './inspection-create/inspection-create.component';

const routes: Routes = [
  { path: '', component: InspectionListComponent },
  { path: 'create', component: InspectionCreateComponent },
  { path: 'detail/:id', component: InspectionDetailComponent },
];

@NgModule({
  declarations: [
    InspectionListComponent,
    InspectionDetailComponent,
    InspectionCreateComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class InspectionModule {
  constructor() {
    console.log('InspectionModule loaded successfully');
  }
}
