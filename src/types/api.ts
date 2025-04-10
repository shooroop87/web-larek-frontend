import { IProduct, IOrder } from './models';

// Интерфейс API клиента для Web ларька
export interface IWebLarekApiClient {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  sendOrder(order: IOrder): Promise<{ success: boolean }>;
}