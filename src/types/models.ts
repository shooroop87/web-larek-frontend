// Данные одного товара
export interface IProduct {
    id: string;
    title: string;
    price: number | null; // для бесценного товара приходит null
    description: string;
    category: string;
    image: string;
}

// Данные оформленного заказа
export interface IOrder {
    id?: string; // ответ от сервера содержит ID заказа
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: string[];
}
  
// Ответ от API после оформления заказа
export interface IOrderResult {
    id: string;
    total: number;
}

export type FormData = Omit<IOrder, 'items' | 'id'>;
export type FormErrors = Partial<Record<keyof FormData, string>>;

// Корзина
export interface ICartItem {
    productId: string;
    quantity: number;
}

// Интерфейс модели корзины
export interface ICartModel {
    addItem(product: IProduct): void;
    removeItem(productId: string): void;
    hasItem(productId: string): boolean;
    getItems(): ICartItem[];
    clear(): void;
    getTotalPrice(): number;
}

// Интерфейс модели каталога
export interface ICatalogModel {
    setProducts(products: IProduct[]): void;
    getProducts(): IProduct[];
    selectProduct(id: string): void;
    getSelected(): IProduct | null;
}