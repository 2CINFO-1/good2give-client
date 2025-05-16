import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./scraps-list/scraps-list.component').then(
        (c) => c.ScrapsListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./scrap-create/scrap-create.component').then(
        (c) => c.ScrapCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./scrap-detail/scrap-detail.component').then(
        (c) => c.ScrapDetailComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ScrapsModule {}
