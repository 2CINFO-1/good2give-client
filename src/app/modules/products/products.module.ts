import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductFormComponent } from './product-form/product-form.component';

@NgModule({
  declarations: [ProductEditComponent, ProductFormComponent],
  imports: [CommonModule, ProductsRoutingModule, ReactiveFormsModule],
})
export class ProductsModule {}
