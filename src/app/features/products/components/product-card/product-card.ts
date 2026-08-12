import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements OnInit {
  @Input({ required: true })
  product!: Product;

  @Output()
  productDeleted = new EventEmitter<void>();

  isAuthenticated = false;
  isDeleting = false;
  actionMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refreshAuthState();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.refreshAuthState();
      }
    });
  }

  public openProduct(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  public editProduct(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/products', this.product.id, 'edit']);
  }

  public deleteProduct(event: Event): void {
    event.stopPropagation();

    this.refreshAuthState();

    if (!this.isAuthenticated || this.isDeleting) {
      this.actionMessage = 'Could not delete product';
      return;
    }

    this.isDeleting = true;
    this.actionMessage = '';

    this.productService.deleteProduct(
      this.product.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.productDeleted.emit();
      },
      error: () => {
        this.isDeleting = false;
      }
    });
  }

  private refreshAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.changeDetectorRef.detectChanges();
  }
}
