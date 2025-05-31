import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionDashboardComponent } from './inspection-dashboard/inspection-dashboard.component';
import { InspectionDetailComponent } from './inspection-detail/inspection-detail.component';
import { InspectionChecklistComponent } from './inspection-checklist/inspection-checklist.component';

const routes: Routes = [
  {
    path: '',
    component: InspectionDashboardComponent
  },
  {
    path: ':id',
    component: InspectionDetailComponent
  },
  {
    path: ':id/checklist',
    component: InspectionChecklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { } 