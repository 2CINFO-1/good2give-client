import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { LandingModule } from '../landing/landing.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    LandingModule
  ],
  exports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class HomeModule { }
