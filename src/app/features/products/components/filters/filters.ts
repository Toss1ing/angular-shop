import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product';
import {
  FacetOption,
  FacetOptionPriceLabel,
  FacetOptionRatingLabel,
  FacetOptionStockLabel,
  FilterState
} from '../../models/facetOption';
import { ProductFilterService } from '../../service/fiter.service';

@Component({
  selector: 'app-filters',
  standalone: false,
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters implements OnChanges {
  @Input({ required: true })
  products!: Product[];

  @Output()
  apply = new EventEmitter<FilterState>();

  filterState: FilterState = {
    prices: [],
    ratings: [],
    stocks: [],
  };

  priceOpened = true;
  stockOpened = true;
  ratingOpened = true;

  matchedProducts = 0;

  constructor(private productFilterService: ProductFilterService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.createPriceFacets();
      this.createStockFacets();
      this.createRatingFacets();
      this.recalculateFacetsCounts();
    }
  }

  public togglePrice(price: FacetOption): void {
    price.selected = !price.selected;
    this.calculateMatchedProducts();
  }

  public toggleStock(stock: FacetOption): void {
    stock.selected = !stock.selected;
    this.calculateMatchedProducts();
  }

  public toggleRating(rating: FacetOption): void {
    rating.selected = !rating.selected;
    this.calculateMatchedProducts();
  }

  public clearAll(): void {
    this.filterState.prices.forEach((x) => (x.selected = false));
    this.filterState.stocks.forEach((x) => (x.selected = false));
    this.filterState.ratings.forEach((x) => (x.selected = false));
    this.recalculateFacetsCounts();

    this.applyFilters();
  }

  applyFilters(): void {
    const filterState: FilterState = {
      prices: [...this.filterState.prices],
      ratings: [...this.filterState.ratings],
      stocks: [...this.filterState.stocks],
    };

    this.apply.emit(filterState);
  }

  get hasSelectedFilters(): boolean {
    return [
      ...this.filterState.prices,
      ...this.filterState.stocks,
      ...this.filterState.ratings,
    ].some((x) => x.selected);
  }

  get selectedPricesCount(): number {
    return this.filterState.prices.filter((x) => x.selected).length;
  }

  get selectedStocksCount(): number {
    return this.filterState.stocks.filter((x) => x.selected).length;
  }

  get selectedRatingsCount(): number {
    return this.filterState.ratings.filter((x) => x.selected).length;
  }

  private calculateMatchedProducts(): void {
    this.matchedProducts = this.productFilterService.filter(this.products, this.filterState).length;
  }

  private createPriceFacets(): void {
    this.filterState.prices = [
      {
        label: FacetOptionPriceLabel.LOVER_THAN_50,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionPriceLabel.BETWEEN_50_AND_100,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionPriceLabel.BETWEEN_100_AND_200,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionPriceLabel.OVER_THAN_200,
        count: 0,
        selected: false,
      },
    ];
  }

  private createStockFacets(): void {
    this.filterState.stocks = [
      {
        label: FacetOptionStockLabel.IN_STOCK,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionStockLabel.OUT_OF_STOCK,
        count: 0,
        selected: false,
      },
    ];

  }

  private createRatingFacets(): void {
    this.filterState.ratings = [
      {
        label: FacetOptionRatingLabel.BETWEEN_0_AND_2,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionRatingLabel.BETWEEN_2_AND_3,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionRatingLabel.BETWEEN_3_AND_4,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionRatingLabel.BETWEEN_4_AND_5,
        count: 0,
        selected: false,
      },
      {
        label: FacetOptionRatingLabel.FIVE_STARS,
        count: 0,
        selected: false,
      },
    ];
  }

  private calculateRatingCount() : void {
    this.filterState.ratings =
      this.productFilterService.calculateRatingCounts(
        this.products,
        this.filterState.ratings
      );
  }

  private calculateStockCount() : void {
    this.filterState.stocks =
      this.productFilterService.calculateStockCounts(
        this.products,
        this.filterState.stocks
      );
  }

  private calculatePriceCount(): void {
    this.filterState.prices =
      this.productFilterService.calculatePriceCounts(
        this.products,
        this.filterState.prices
      );
  }

  private recalculateFacetsCounts(): void {
    this.calculateRatingCount();
    this.calculateStockCount();
    this.calculatePriceCount();
  }
}
