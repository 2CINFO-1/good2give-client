import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Import components using relative paths
import { ScrapsListComponent } from './scraps-list/scraps-list.component';
import { ScrapDetailComponent } from './scrap-detail/scrap-detail.component';
import { ScrapCreateNewComponent } from './scrap-create-new/scrap-create-new.component';

const routes: Routes = [
  { path: '', component: ScrapsListComponent },
  { path: 'create', component: ScrapCreateNewComponent },
  { path: ':id', component: ScrapDetailComponent },
];

@NgModule({
  declarations: [
    ScrapsListComponent,
    ScrapDetailComponent,
    ScrapCreateNewComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class ScrapsModule {}
