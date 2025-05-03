import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectesListComponent } from './collectes-list/collectes-list.component';
import { CollecteDetailComponent } from './collecte-detail/collecte-detail.component';
import { CollecteCreateComponent } from './collecte-create/collecte-create.component';
import { CollecteService } from '../../services/collecte.service';

const routes: Routes = [
  {
    path: '',
    component: CollectesListComponent,
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
    CollectesListComponent,
    CollecteDetailComponent,
    CollecteCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: 'CollecteService', useClass: CollecteService }],
})
export class CollectesModule {}
