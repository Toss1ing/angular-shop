import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { PlpPage } from './features/products/pages/plp-page/plp-page';
import { ProductDetailsPage } from './features/products/pages/product-details-page/product-details-page';
import { ProductEditPage } from './features/products/pages/product-edit-page/product-edit-page';
import { SignupPage } from './features/auth/pages/signup-page/signup-page';

export const routes: Routes = [
  {
    path: '',
    component: PlpPage,
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart-module').then((m) => m.CartModule),
    canActivate: [authGuard],
  },
  {
    path: 'products/:id/edit',
    component: ProductEditPage,
    canActivate: [authGuard],
  },
  {
    path: 'products/:id',
    component: ProductDetailsPage,
  },
  {
    path: 'product/create',
    component: ProductEditPage,
    canActivate: [authGuard],
  },
  {
    path: 'singup',
    component: SignupPage,
  }
];
