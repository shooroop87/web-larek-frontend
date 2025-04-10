// Данные одного товара
export interface IProduct {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

// Данные оформленного заказа
export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: string[];
}

// Корзина
export interface ICartItem {
    productId: string;
    quantity: number;
}