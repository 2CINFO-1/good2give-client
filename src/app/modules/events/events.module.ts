import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { EventsListComponent } from './events-list/events-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';

const routes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'create', component: EventCreateComponent },
  { path: 'edit/:id', component: EventEditComponent },
  { path: ':id', component: EventDetailComponent },
];

@NgModule({
  declarations: [
    EventsListComponent,
    EventDetailComponent,
    EventCreateComponent,
    EventEditComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LeafletModule
  ],
})
export class EventsModule {}
