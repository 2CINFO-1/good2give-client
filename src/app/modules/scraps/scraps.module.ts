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
      import('./scrap-create-new/scrap-create-new.component').then(
        (c) => c.ScrapCreateNewComponent
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
