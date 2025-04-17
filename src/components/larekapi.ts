import { Api } from './base/api';

/**
 * API для взаимодействия с сервером Веб-Ларька
 */
export class LarekAPI extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string) {
    super(baseUrl);
    this.cdn = cdn;
  }

  /**
   * Получение списка всех товаров
   */
  async getProducts(): Promise<any[]> {
    try {
      const response = await this.get('/product');
      
      // Если API вернуло данные в формате { items: [], total: number }
      if (response && response.items) {
        // Добавляем полный путь к изображениям
        return response.items.map(item => ({
          ...item,
          image: item.image.startsWith('http') ? item.image : this.cdn + item.image
        }));
      }
      
      // Если API вернуло просто массив товаров
      if (Array.isArray(response)) {
        return response.map(item => ({
          ...item,
          image: item.image.startsWith('http') ? item.image : this.cdn + item.image
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Создание заказа
   */
  async createOrder(order): Promise<any> {
    try {
      const response = await this.post('/order', order);
      
      // Если API вернуло данные в формате { result: {...} }
      if (response && response.result) {
        return response.result;
      }
      
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}