export interface IProduct {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }
  
  export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: string[];
  }
  
  export interface ICartItem {
    productId: string;
    quantity: number;
  }