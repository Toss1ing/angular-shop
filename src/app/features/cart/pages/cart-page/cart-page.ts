import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../products/service/product.service';
import { Cart, CartItem } from '../../models/cart';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  isUpdating = false;
  itemErrorMessage = '';
  productStockMap: Record<string, number> = {};
  productImageMap: Record<string, string> = {};
  pageIndex: number = 0;
  pageSize: number = 3;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProductsAndCart();
  }

  get paginatedCartProducts(): CartItem[] {
    if (!this.cart) {
      return [];
    }

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    return this.cart?.products.slice(startIndex, endIndex);
  }

  get totalItems(): number {
    if (!this.cart?.products.length) {
      return 0;
    }

    return this.cart.products.reduce((total, item) => total + item.count, 0);
  }

  get totalPrice(): number {
    if (!this.cart?.products.length) {
      return 0;
    }

    return this.cartService.getTotalPrice(this.cart.products);
  }

  get totalPages(): number {
    if (!this.cart?.products.length) {
      return 0;
    }

    return Math.ceil(this.cart.products.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  goToPageByNumber(pageNumber: number) {
    this.pageIndex = pageNumber;
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
    }
  }

  goToFirstPage(): void {
    this.pageIndex = 0;
  }

  goToLastPage(): void {
    this.pageIndex = this.totalPages - 1;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  getStock(item: CartItem): number {
    return this.productStockMap[String(item.id)] ?? item.count;
  }

  getProductImage(item: CartItem): string {
    return this.productImageMap[String(item.id)] ?? '';
  }

  canIncrement(item: CartItem): boolean {
    return item.count < this.getStock(item);
  }

  openProduct(item: CartItem): void {
    this.router.navigate(['/products', item.id]);
  }

  incrementItem(item: CartItem): void {
    this.updateItemCount(item, 1);
  }

  decrementItem(item: CartItem): void {
    this.updateItemCount(item, -1);
  }

  removeItem(cartItemId: string): void {
    this.isUpdating = true;
    this.itemErrorMessage = '';

    this.cartService.removeProduct(cartItemId).subscribe({
      next: () => {
        this.loadCart(false);
        this.isUpdating = false;
      },
      error: () => {
        this.isUpdating = false;
      },
    });
  }

  goToProducts(): void {
    this.router.navigate(['/']);
  }

  private updateItemCount(item: CartItem, delta: number): void {
    this.isUpdating = true;
    this.itemErrorMessage = '';

    this.cartService.changeCartItemCount(item.id, delta, this.getStock(item)).subscribe({
      next: () => {
        this.loadCart(false);
      },
      error: () => {
        this.isUpdating = false;
        this.itemErrorMessage = 'Could not update product count';
      },
    });
  }

  private loadProductsAndCart(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productStockMap = {};
        this.productImageMap = {};

        products.forEach((product) => {
          const productId = String(product.id);
          this.productStockMap[productId] = product.stock;
          this.productImageMap[productId] = product.image;
        });

        this.loadCart(true);
      },
      error: () => {
        this.loadCart(true);
      },
    });
  }

  private loadCart(showLoader: boolean): void {
    if (showLoader) {
      this.isLoading = true;
    }

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        this.isUpdating = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.isUpdating = false;
      },
    });
  }
}
