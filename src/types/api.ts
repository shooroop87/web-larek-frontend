import { IProduct, IOrder } from './models';

/**
 * Ответ API со списком элементов
 */
export type ApiListResponse<Type> = {
  items: Type[];
  total: number;
};

/**
 * Ответ API с результатом запроса
 */
export type ApiPostResponse<Type> = {
  result: Type;
};

/**
 * Результат создания заказа
 */
export interface IOrderResult {
  id: string;
  total: number;
}

/**
 * Интерфейс API клиента для Web ларька
 */
export interface IWebLarekApiClient {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  createOrder(order: IOrder): Promise<IOrderResult>;
}