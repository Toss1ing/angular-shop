import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Review } from '../models/review';
import { environment } from '../../../enviroment/environment.dev';

export interface ProductPayload {
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  rating?: {
    rate: number;
    count: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  API_URL: string = 'products';
  REVIEWS_URL: string = 'reviews';
  PRODUCT_ID_ATTRIBUTE: string = 'productId';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/${this.API_URL}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/${this.API_URL}/${id}`);
  }

  updateProduct(id: string, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/${this.API_URL}/${id}`, {
      id,
      ...payload,
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.API_URL}/${id}`);
  }

  getReviewsByProductId(productId: string): Observable<Review[]> {
    const params = new HttpParams().set(this.PRODUCT_ID_ATTRIBUTE, productId);

    return this.http.get<Review[]>(`${environment.apiUrl}/${this.REVIEWS_URL}`, { params });
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/${this.API_URL}`, payload);
  }
}
