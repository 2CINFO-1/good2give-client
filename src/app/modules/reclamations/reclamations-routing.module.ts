import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamationsComponent } from './reclamations.component';
import { ReclamationCreateComponent } from './reclamation-create/reclamation-create.component';
import { ReclamationDetailComponent } from './reclamation-detail/reclamation-detail.component';
import { ReclamationUpdateComponent } from './reclamation-update/reclamation-update.component';
import { ReclamationResListComponent } from './reclamation-res-list/reclamation-res-list.component';
import { ReclamationResDetailComponent } from './reclamation-res-detail/reclamation-res-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReclamationsComponent
  },
  {
    path: 'create',
    component: ReclamationCreateComponent
  },
  {
    path: ':id',
    component: ReclamationDetailComponent
  },
  {
    path: ':id/update',
    component: ReclamationUpdateComponent
  },
  {
    path: 'resolutions',
    children: [
      {
        path: '',
        component: ReclamationResListComponent
      },
      {
        path: ':id',
        component: ReclamationResDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclamationsRoutingModule { } 