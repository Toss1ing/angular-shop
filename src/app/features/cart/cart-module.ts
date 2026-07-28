import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartPage } from './pages/cart-page/cart-page';
import { CartRoutingModule } from './cart-routing-module';
import { MaterialModule } from '../../shared/material/material-module';

@NgModule({
  declarations: [CartPage],
  imports: [CommonModule, MaterialModule, CartRoutingModule],
})
export class CartModule {}
