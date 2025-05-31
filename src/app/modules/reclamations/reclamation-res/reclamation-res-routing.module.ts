import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamationResListComponent } from '../reclamation-res-list/reclamation-res-list.component';
import { ReclamationResDetailComponent } from '../reclamation-res-detail/reclamation-res-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReclamationResListComponent
  },
  {
    path: ':id',
    component: ReclamationResDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclamationResRoutingModule { } 