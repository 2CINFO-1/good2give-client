import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reclamation-res.component').then(
        (c) => c.ReclamationResComponent
      ),
  },
  {
    path: 'all-resolutions',
    loadComponent: () =>
      import('./all-resolutions/all-resolutions.component').then(
        (c) => c.AllResolutionsComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./reclamation-res-create/reclamation-res-create.component').then(
        (c) => c.ReclamationResCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./reclamation-res-detail/reclamation-res-detail.component').then(
        (c) => c.ReclamationResDetailComponent
      ),
  },
  {
    path: ':id/update',
    loadComponent: () =>
      import('./reclamation-res-update/reclamation-res-update.component').then(
        (c) => c.ReclamationResUpdateComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ReclamationResModule {}
