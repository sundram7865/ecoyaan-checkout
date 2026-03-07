export interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
  max_stock: number;
}

export interface CartData {
  cartItems: Product[];
  shipping_fee: number;
  discount_applied: number;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface SavedAddress extends Address {
  id: string;
  label: string; // "Home" | "Work" | any custom string
}