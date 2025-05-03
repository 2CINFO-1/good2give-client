import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamationsComponent } from './reclamations.component';

const routes: Routes = [
  {
    path: '',
    component: ReclamationsComponent,
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./reclamation-create/reclamation-create.component').then(
        (c) => c.ReclamationCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./reclamation-detail/reclamation-detail.component').then(
        (c) => c.ReclamationDetailComponent
      ),
  },
  {
    path: ':id/update',
    loadComponent: () =>
      import('./reclamation-update/reclamation-update.component').then(
        (c) => c.ReclamationUpdateComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ReclamationsModule {}
