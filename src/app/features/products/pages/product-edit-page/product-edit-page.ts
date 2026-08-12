import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-edit-page',
  standalone: false,
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.scss',
})
export class ProductEditPage implements OnInit {
  productForm: FormGroup;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  productId = '';

  isEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      image: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      ratingRate: [0, [Validators.min(0), Validators.max(5)]],
      ratingCount: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {

    this.isEdit = this.route.routeConfig?.path === 'products/:id/edit'

    if(this.isEdit) {
      this.productId = this.route.snapshot.paramMap.get('id') ?? '';

      if (!this.productId) {
        this.errorMessage = 'Product not found';
        return;
      }

      this.loadProduct();
    }

    this.isLoading = false;
  }

  onPlpPage(): void {
    this.router.navigate(['/']);
  }

  submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if(this.isEdit) {
      this.updateProduct();
    }
    else {
      this.createProduct();
    }
  }

  private loadProduct(): void {
    this.productService.getProductById(
      this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          title: product.title,
          price: Number(product.price),
          description: product.description,
          image: product.image,
          stock: product.stock,
          ratingRate: product.rating?.rate ?? 0,
          ratingCount: product.rating?.count ?? 0,
        });
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Product not found';
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private updateProduct(): void {
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.productForm.getRawValue();

    this.productService.updateProduct(
      this.productId,
      {
        title: formValue.title,
        price: Number(formValue.price),
        description: formValue.description,
        image: formValue.image,
        stock: Number(formValue.stock),
        rating: {
          rate: Number(formValue.ratingRate),
          count: Number(formValue.ratingCount),
        },
      },).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/products', this.productId]);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Could not update product';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private createProduct(): void {
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.productForm.getRawValue();

    const product = {
      title: formValue.title,
      price: Number(formValue.price),
      description: formValue.description,
      image: formValue.image,
      stock: Number(formValue.stock),
      rating: {
        rate: Number(formValue.ratingRate),
        count: Number(formValue.ratingCount),
      },
    };

    this.productService.createProduct(
      product).subscribe({
      next: (createdProduct) => {
        console.log(createdProduct)
        this.isSaving = false;
        this.router.navigate([`/products/${createdProduct.id}`]);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Product not created';
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
