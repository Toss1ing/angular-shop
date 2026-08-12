import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing-module';
import { PlpPage } from './pages/plp-page/plp-page';
import { MaterialModule } from '../../shared/material/material-module';
import { ProductCard } from './components/product-card/product-card';
import { Filters } from './components/filters/filters';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { ProductCartActions } from './components/product-cart-actions/product-cart-actions';
import { ProductEditPage } from './pages/product-edit-page/product-edit-page';
import { ProductFilterPipe } from './pipes/product-filter.pipe';
import { StockStatusDirective } from './directives/stock-status.directive';

@NgModule({
  declarations: [
    PlpPage,
    ProductCard,
    ProductCartActions,
    Filters,
    ProductDetailsPage,
    ProductEditPage,
    ProductFilterPipe,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    StockStatusDirective,
  ],
  exports: [PlpPage, ProductDetailsPage, ProductEditPage],
})
export class ProductsModule {}
