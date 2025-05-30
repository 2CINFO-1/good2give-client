import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
  },
];

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DashboardHomeComponent],
})
export class DashboardHomeModule {}
