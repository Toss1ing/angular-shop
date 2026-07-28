export interface CartItem {
  id: string;
  title: string;
  count: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  products: CartItem[];
}
