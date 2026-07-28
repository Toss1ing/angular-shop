
export interface FacetOption {
  label: string;
  count: number;
  selected: boolean;
}

export interface FilterState {
  prices: FacetOption[],
  stocks: FacetOption[],
  ratings: FacetOption[]
}

export enum FacetOptionPriceLabel {
  LOVER_THAN_50 = 'lower than 50$',
  BETWEEN_50_AND_100 = '50 - 100$',
  BETWEEN_100_AND_200 = '100 - 200$',
  OVER_THAN_200 = 'over 200$',
}

export enum FacetOptionRatingLabel {
  BETWEEN_0_AND_2 ='0 - 2',
  BETWEEN_2_AND_3 = '2 - 3',
  BETWEEN_3_AND_4 = '3 - 4',
  BETWEEN_4_AND_5 = '4 - 5',
  FIVE_STARS = '5 stars'
}

export enum FacetOptionStockLabel {
  IN_STOCK = 'In stock',
  OUT_OF_STOCK = 'Out of stock',
}
