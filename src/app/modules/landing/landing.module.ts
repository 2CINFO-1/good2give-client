import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingEventsComponent } from './landing-events/landing-events.component';
import { LandingProductsComponent } from './landing-products/landing-products.component';
import { LandingHeaderComponent } from './landing-header/landing-header.component';

const routes: Routes = [
  {
    path: 'events',
    component: LandingEventsComponent
  },
  {
    path: 'products',
    component: LandingProductsComponent
  }
];

@NgModule({
  declarations: [
    LandingEventsComponent,
    LandingProductsComponent,
    LandingHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    LandingEventsComponent,
    LandingProductsComponent,
    LandingHeaderComponent
  ]
})
export class LandingModule { }
