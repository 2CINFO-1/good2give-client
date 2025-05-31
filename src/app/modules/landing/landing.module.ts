import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingEventsComponent } from './landing-events/landing-events.component';

const routes: Routes = [
  {
    path: 'events',
    component: LandingEventsComponent
  }
];

@NgModule({
  declarations: [
    LandingEventsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LandingModule { } 