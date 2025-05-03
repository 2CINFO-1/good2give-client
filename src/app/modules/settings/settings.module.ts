import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { SecurityComponent } from './security/security.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsLayoutComponent } from './settings-layout/settings-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsLayoutComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'notifications', component: NotificationsComponent },
    ],
  },
];

@NgModule({
  declarations: [
    ProfileComponent,
    SecurityComponent,
    NotificationsComponent,
    SettingsLayoutComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class SettingsModule {}
