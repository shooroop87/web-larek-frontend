import { Api } from './base/api';
import { IProduct, IOrderData, IOrderResult } from '../types';

export class LarekAPI extends Api {
    private products: IProduct[] = [];
    private cdnUrl: string;

    constructor(baseUrl: string, options: RequestInit = {}, cdnUrl?: string) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl || baseUrl; // fallback на baseUrl, если CDN не передан
    }

  /**
   * Получение списка товаров
   */
  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.get('/product/') as {
        total: number;
        items: IProduct[];
      };
  
      const products = response.items || [];
  
      this.products = products.map(product => ({
        ...product,
        image: this.processImageUrl(product.image),
        price: product.price ?? null
      }));
  
      return this.products;
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      return [];
    }
  }

  /**
   * Обработка URL изображений
   */
  private processImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${this.cdnUrl}${imageUrl}`;
  }

  /**
   * Создание заказа
   */
  async createOrder(order: IOrderData): Promise<IOrderResult> {
    try {
      // Вычисляем общую сумму на основе товаров в кэше
      const total = order.items.reduce((sum, itemId) => {
        const item = this.products.find(p => p.id === itemId);
        return sum + (item?.price ?? 0);
      }, 0);

      const orderData = {
        ...order,
        total
      };

      const response = await this.post('/order', orderData);
      return response as IOrderResult;
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      throw error;
    }
  }
}