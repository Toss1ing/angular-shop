export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  rating?: ProductRating;
}
