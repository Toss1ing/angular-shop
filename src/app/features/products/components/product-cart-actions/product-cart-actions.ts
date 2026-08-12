import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../../cart/service/cart.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { Exception } from '../../models/exception';

@Component({
  selector: 'app-product-cart-actions',
  standalone: false,
  templateUrl: './product-cart-actions.html',
  styleUrl: './product-cart-actions.scss',
})
export class ProductCartActions implements OnInit {
  @Input({ required: true })
  product!: Product;

  @Input()
  variant: 'card' | 'page' = 'card';

  cartCount = 0;
  isLoading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCartCount();
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.updateCount(() =>
      this.cartService.incrementProduct(this.product).subscribe({
        next: (count) => {
          this.handleSuccess(count);
        },
        error: (message) => {
          this.router.navigate(['/login']);
        },
      }),
    );
  }

  increment(event: Event): void {
    event.stopPropagation();
    this.updateCount(() =>
      this.cartService.incrementProduct(this.product).subscribe({
        next: (count) => {
          this.handleSuccess(count);
        },
        error: (error) => {
          if (error.message === Exception.NOT_AUTH) {
            this.errorMessage = 'Login first please';
          } else if (error.message === 'OUT_OF_STOCK') {
            this.errorMessage = 'Out of stock';
          } else {
            this.errorMessage = 'Something went wrong';
          }
        },
      }),
    );
  }

  decrement(event: Event): void {
    event.stopPropagation();
    this.updateCount(() =>
      this.cartService.decrementProduct(this.product).subscribe({
        next: (count) => {
          this.handleSuccess(count);
        },
        error: (error) => {
          if (error.message === Exception.NOT_AUTH) {
            this.errorMessage = 'Login first please';
          } else {
            this.errorMessage = 'Could not update cart';
          }
        },
      }),
    );
  }

  get canIncrement(): boolean {
    return this.cartCount < this.product.stock;
  }

  private loadCartCount(): void {
    this.cartService.getProductCount(this.product.id).subscribe({
      next: (count) => {
        this.cartCount = count;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.cartCount = 0;
      },
    });
  }

  private updateCount(action: () => void): void {
    this.isLoading = true;
    this.errorMessage = '';
    action();
  }

  private handleSuccess(count: number): void {
    this.cartCount = count;
    this.isLoading = false;
    this.errorMessage = '';
    this.changeDetectorRef.detectChanges();
  }
}
