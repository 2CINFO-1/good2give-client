import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';
import { EmailVerificationGuard } from '../../core/guards/email-verification.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
    canActivate: [EmailVerificationGuard],
  },
];

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DashboardHomeComponent],
})
export class DashboardHomeModule {}
