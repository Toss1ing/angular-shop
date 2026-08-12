import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-details-page',
  standalone: false,
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss',
})
export class ProductDetailsPage implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.errorMessage = 'Product not found';
      this.isLoading = false;
      return;
    }

    this.loadProduct(productId);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getStars(rate: number): number[] {
    return Array.from({ length: 5 }, (_, index) => index + 1);
  }

  get reviewsCount(): number {
    return this.reviews.length || this.product?.rating?.count || 0;
  }

  get displayRating(): number {
    if (this.reviews.length) {
      const total = this.reviews.reduce((sum, review) => sum + review.rate, 0);
      return total / this.reviews.length;
    }

    return this.product?.rating?.rate ?? 0;
  }

  private loadProduct(productId: string): void {
    this.productService.getProductById(
      productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        this.loadReviews(productId);
      },
      error: () => {
        this.errorMessage = 'Product not found';
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private loadReviews(productId: string): void {
    this.productService.getReviewsByProductId(
      productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.reviews = [];
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
