import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ScrapsListComponent } from './scraps-list/scraps-list.component';
import { ScrapCreateComponent } from './scrap-create/scrap-create.component';
import { ScrapDetailComponent } from './scrap-detail/scrap-detail.component';
import { ScrapEditComponent } from './scrap-edit/scrap-edit.component';

const routes: Routes = [
  { path: '', component: ScrapsListComponent },
  { path: 'create', component: ScrapCreateComponent },
  { path: ':id', component: ScrapDetailComponent },
  { path: ':id/edit', component: ScrapEditComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ScrapsListComponent,
    ScrapDetailComponent,
    ScrapEditComponent,
    ScrapCreateComponent
  ],
})
export class ScrapsModule {}
