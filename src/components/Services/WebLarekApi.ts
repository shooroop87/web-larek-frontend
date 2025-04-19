import { ApiListResponse, Api } from '../base/api';
import { ICheckoutSubmission, ICheckoutResult, IProduct } from '../../types';

// Интерфейс, описывающий методы и свойства API WebLarek
export interface IWebLarekApi {
  cdn: string;
  products: IProduct[];
  getProducts: () => Promise<IProduct[]>;
  submitOrder: (order: ICheckoutSubmission) => Promise<ICheckoutResult>;
}

// Класс для работы с API WebLarek
export class WebLarekApi extends Api {
  cdn: string;
  products: IProduct[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // Получаю список товаров с сервера
  getProducts(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // Отправляю заказ на сервер
  submitOrder(order: ICheckoutSubmission): Promise<ICheckoutResult> {
    return this.post(`/order`, order).then((data: ICheckoutResult) => data);
  }
}