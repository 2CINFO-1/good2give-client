import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./collectes-list/collectes-list.component').then(
        (c) => c.CollectesListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./collecte-create/collecte-create.component').then(
        (c) => c.CollecteCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./collecte-detail/collecte-detail.component').then(
        (c) => c.CollecteDetailComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CollectesModule {}
