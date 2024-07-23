export type ProductsResponse = {
  monthly: Product;
  yearly: Product;
  teams: Product;
};

export type Product = {
  id: string;
  price: number;
};
