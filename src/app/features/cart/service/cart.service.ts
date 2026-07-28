import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/service/auth.service';
import { Product } from '../../products/models/product';
import { environment } from '../../../enviroment/environment.dev';
import { Cart, CartItem } from '../models/cart';
import { map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private API_URL = 'cart';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  addProduct(product: Product): Observable<number> {
    return this.changeProductCount(product, 1);
  }

  incrementProduct(product: Product): Observable<number> {
    return this.changeProductCount(product, 1);
  }

  decrementProduct(product: Product): Observable<number> {
    return this.getProductCount(product.id).pipe(
      switchMap((currentCount) => {
        if (currentCount <= 1) {
          return this.removeProduct(product.id).pipe(map(() => 0));
        }

        return this.changeProductCount(product, -1);
      }),
    );
  }

  getProductCount(productId: number | string): Observable<number> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('NOT_AUTH'));
    }

    return this.loadCartByUserId(user.id).pipe(
      map((cart) => {
        if (!cart) {
          return 0;
        }

        const item = cart.products.find((product) => product.id === productId);

        return item?.count ?? 0;
      }),
    );
  }

  getCart(): Observable<Cart | null> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('NOT_AUTH'));
    }

    return this.loadCartByUserId(user.id);
  }

  removeProduct(cartItemId: string): Observable<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('NOT_AUTH'));
    }

    return this.loadCartByUserId(user.id).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('CART_NOT_FOUND'));
        }

        const products = cart.products.filter((item) => item.id != cartItemId);

        return this.patchCart(cart.id, products).pipe(map(() => void 0));
      }),
    );
  }

  changeCartItemCount(cartItemId: string, delta: number, maxStock: number): Observable<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('NOT_AUTH'));
    }

    return this.loadCartByUserId(user.id).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('CART_NOT_FOUND'));
        }

        const products = [...cart.products];

        const itemIndex = products.findIndex((item) => item.id == cartItemId);

        if (itemIndex < 0) {
          return throwError(() => new Error('PRODUCT_NOT_FOUND'));
        }

        const nextCount = products[itemIndex].count + delta;

        if (nextCount <= 0) {
          products.splice(itemIndex, 1);
        } else if (nextCount > maxStock) {
          return throwError(() => new Error('OUT_OF_STOCK'));
        } else {
          products[itemIndex] = {
            ...products[itemIndex],
            count: nextCount,
          };
        }

        return this.patchCart(cart.id, products).pipe(map(() => undefined));
      }),
    );
  }

  getTotalPrice(products: CartItem[]): number {
    return products.reduce((total, item) => total + item.price * item.count, 0);
  }

  private changeProductCount(product: Product, delta: number): Observable<number> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('NOT_AUTH'));
    }
    return this.loadCartByUserId(user.id).pipe(
      switchMap((cart) => {
        if (!cart) {
          if (delta < 0) {
            return of(0);
          }

          return this.createCart(user.id, product);
        }

        return this.updateCartWithProduct(cart, product, delta);
      }),
    );
  }

  private loadCartByUserId(userId: string): Observable<Cart | null> {
    return this.http.get<Cart[]>(`${environment.apiUrl}/${this.API_URL}`).pipe(
      map((carts) => {
        return carts.find((cart) => cart.userId === userId) ?? null;
      }),
    );
  }

  private createCart(userId: string, product: Product): Observable<number> {
    return this.http
      .post<Cart>(`${environment.apiUrl}/${this.API_URL}`, {
        userId: userId,
        products: [this.toCartItem(product)],
      })
      .pipe(map(() => 1));
  }

  private updateCartWithProduct(cart: Cart, product: Product, delta: number): Observable<number> {
    const products = [...cart.products];
    const existingItemIndex = products.findIndex((item) => item.id == product.id);
    let nextCount = delta;

    if (existingItemIndex >= 0) {
      nextCount = products[existingItemIndex].count + delta;

      if (nextCount <= 0) {
        products.splice(existingItemIndex, 1);
        return this.patchCart(cart.id, products).pipe(map(() => 0));
      }

      if (nextCount > product.stock) {
        return throwError(() => new Error('OUT_OF_STOCK'));
      }

      products[existingItemIndex] = {
        ...products[existingItemIndex],
        count: nextCount,
      };
    } else {
      if (delta < 0) {
        return of(0);
      }

      nextCount = 1;
      products.push(this.toCartItem(product));
    }

    return this.patchCart(cart.id, products).pipe(map(() => nextCount));
  }

  private patchCart(cartId: string, products: CartItem[]): Observable<Cart> {
    return this.http.patch<Cart>(`${environment.apiUrl}/${this.API_URL}/${cartId}`, { products });
  }

  private toCartItem(product: Product): CartItem {
    return {
      id: product.id,
      title: product.title,
      count: 1,
      price: Number(product.price),
    };
  }
}
