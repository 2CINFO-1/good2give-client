import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: ProductEditComponent,
  },
  {
    path: 'form',
    component: ProductFormComponent,
  },
  {
    path: 'form/:id',
    component: ProductFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
