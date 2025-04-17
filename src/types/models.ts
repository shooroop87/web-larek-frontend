/**
 * Категории товаров
 */
export type ProductCategory = string;

/**
 * Товар из каталога
 */
export interface IProduct {
  id: string;
  title: string;
  description?: string;
  price: number | null;
  category: ProductCategory;
  image: string;
}

/**
 * Методы оплаты
 */
export type PaymentMethod = 'card' | 'cash';

/**
 * Информация о заказе
 */
export interface IOrder {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

/**
 * Состояние приложения
 */
export interface IAppState {
  catalog: IProduct[];
  basket: IProduct[];
  preview: IProduct | null;
  order: IOrder;

  setCatalog(items: IProduct[]): void;
  getProductById(id: string): IProduct | null;
  addToBasket(product: IProduct): void;
  removeFromBasket(id: string): void;
  clearBasket(): void;
  setPreview(product: IProduct | null): void;
  updateOrder(data: Partial<IOrder>): void;
  getTotalPrice(): number;
  clearOrder(): void;
}