import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModulePlaceholderComponent } from './components/module-placeholder/module-placeholder.component';

@NgModule({
  declarations: [ModulePlaceholderComponent],
  imports: [CommonModule, RouterModule],
  exports: [ModulePlaceholderComponent],
})
export class SharedModule {}
