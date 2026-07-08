import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing-module';
import { PlpPage } from './pages/plp-page/plp-page';
import { MaterialModule } from '../../shared/material/material-module';
import { ProductCard } from './components/product-card/product-card';
import { Filters } from './components/filters/filters';

@NgModule({
  declarations: [PlpPage, ProductCard, Filters],
  imports: [CommonModule, ProductsRoutingModule, MaterialModule],
  exports: [PlpPage],
})
export class ProductsModule {}
