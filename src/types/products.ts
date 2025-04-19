export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}
  
export interface ICartItem {
    productId: string;
    quantity: number;
}