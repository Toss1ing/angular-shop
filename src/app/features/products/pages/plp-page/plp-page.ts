import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { FilterState } from '../../models/facetOption';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plp-page',
  standalone: false,
  templateUrl: './plp-page.html',
  styleUrl: './plp-page.scss',
})
export class PlpPage implements OnInit {
  products$!: Observable<Product[]>;
  filters: FilterState = {
    prices: [],
    stocks: [],
    ratings: []
  }

  constructor(
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  onApplyFilters(filterState: FilterState): void {
    this.filters = filterState;
  }

  onProductDeleted(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products$ = this.productService.getProducts()
  }
}
