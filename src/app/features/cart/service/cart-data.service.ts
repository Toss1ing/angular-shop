import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../enviroment/environment.dev';
import { Cart, CartItem } from '../models/cart';
import { Product } from '../../products/models/product';

@Injectable({
  providedIn: 'root',
})
export class CartDataService {
  private readonly API_URL = 'cart';

  constructor(private http: HttpClient) {}

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(
      `${environment.apiUrl}/${this.API_URL}`,
    );
  }

  createCart(userId: string, products: Product): Observable<Cart> {
    return this.http.post<Cart>(
      `${environment.apiUrl}/${this.API_URL}`,
      {
        userId,
        products,
      },
    );
  }

  updateCart(cartId: string, products: CartItem[]): Observable<Cart> {
    return this.http.patch<Cart>(`${environment.apiUrl}/${this.API_URL}/${cartId}`, { products });
  }
}
