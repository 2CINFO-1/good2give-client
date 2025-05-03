import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollecteListComponent } from './collecte-list/collecte-list.component';
import { CollecteDetailComponent } from './collecte-detail/collecte-detail.component';
import { CollecteCreateComponent } from './collecte-create/collecte-create.component';
import { CollecteService } from '../../services/collecte.service';

const routes: Routes = [
  {
    path: '',
    component: CollecteListComponent,
  },
  {
    path: 'create',
    component: CollecteCreateComponent,
  },
  {
    path: ':id',
    component: CollecteDetailComponent,
  },
];

@NgModule({
  declarations: [
    CollecteListComponent,
    CollecteDetailComponent,
    CollecteCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [{ provide: 'CollecteService', useClass: CollecteService }],
})
export class CollecteModule {}
