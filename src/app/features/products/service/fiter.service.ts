import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import {
  FacetOption,
  FacetOptionPriceLabel,
  FacetOptionRatingLabel,
  FacetOptionStockLabel,
  FilterState
} from '../models/facetOption';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {

  filter(products: Product[], filterState: FilterState): Product[] {
    return products.filter(
      (product) =>
        this.matchesPrice(product, filterState.prices) &&
        this.matchesRating(product, filterState.ratings) &&
        this.matchesStock(product, filterState.stocks),
    );
  }

  calculatePriceCounts(
    products: Product[],
    options: FacetOption[],
  ): FacetOption[] {

    return options.map(option => ({
      ...option,
      count: products.filter(product =>
        this.matchesPriceOption(product, option)
      ).length
    }));
  }

  calculateStockCounts(
    products: Product[],
    options: FacetOption[],
  ): FacetOption[] {

    return options.map(option => ({
      ...option,
      count: products.filter(product =>
        this.matchesStockOption(product, option)
      ).length
    }));
  }

  calculateRatingCounts(
    products: Product[],
    options: FacetOption[],
  ): FacetOption[] {

    return options.map(option => ({
      ...option,
      count: products.filter(product =>
        this.matchesRatingOption(product, option)
      ).length
    }));
  }

  private matchesPrice(product: Product, options: FacetOption[]): boolean {
    const selected = options.filter(option => option.selected);

    if (!selected.length) {
      return true;
    }

    return selected.some(option =>
      this.matchesPriceOption(product, option)
    );
  }

  private matchesPriceOption(
    product: Product,
    option: FacetOption
  ): boolean {

    const price = Number(product.price);

    switch (option.label) {
      case FacetOptionPriceLabel.LOVER_THAN_50:
        return price < 50;

      case FacetOptionPriceLabel.BETWEEN_50_AND_100:
        return price >= 50 && price < 100;

      case FacetOptionPriceLabel.BETWEEN_100_AND_200:
        return price >= 100 && price < 200;

      case FacetOptionPriceLabel.OVER_THAN_200:
        return price >= 200;

      default:
        return false;
    }
  }

  private matchesRating(product: Product, options: FacetOption[]): boolean {
    const selected = options.filter(option => option.selected);

    if (!selected.length) {
      return true;
    }

    return selected.some(option =>
      this.matchesRatingOption(product, option)
    );
  }

  private matchesRatingOption(
    product: Product,
    option: FacetOption
  ): boolean {

    const rating = Number(product.rating?.rate ?? 0);

    switch (option.label) {
      case FacetOptionRatingLabel.BETWEEN_0_AND_2:
        return rating < 2;

      case FacetOptionRatingLabel.BETWEEN_2_AND_3:
        return rating >= 2 && rating < 3;

      case FacetOptionRatingLabel.BETWEEN_3_AND_4:
        return rating >= 3 && rating < 4;

      case FacetOptionRatingLabel.BETWEEN_4_AND_5:
        return rating >= 4 && rating < 5;

      case FacetOptionRatingLabel.FIVE_STARS:
        return rating === 5;

      default:
        return false;
    }
  }

  private matchesStock(product: Product, options: FacetOption[]): boolean {
    const selected = options.filter(option => option.selected);

    if (!selected.length) {
      return true;
    }

    return selected.some(option =>
      this.matchesStockOption(product, option)
    );
  }

  private matchesStockOption(
    product: Product,
    option: FacetOption
  ): boolean {

    switch (option.label) {
      case FacetOptionStockLabel.IN_STOCK:
        return product.stock > 0;

      case FacetOptionStockLabel.OUT_OF_STOCK:
        return product.stock <= 0;

      default:
        return false;
    }
  }
}
