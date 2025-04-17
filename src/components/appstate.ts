import { EventEmitter } from './base/events';

/**
 * Класс состояния приложения
 */
export class AppState extends EventEmitter {
  private _products: any[] = [];
  private _basket: any[] = [];
  private _preview: any | null = null;
  private _order: any = {
    payment: 'card',
    address: '',
    email: '',
    phone: '',
    items: [],
    total: 0
  };

  /**
   * Установить список товаров из каталога
   */
  setCatalog(items: any[]): void {
    this._products = items.map(item => ({
      ...item,
      inBasket: false
    }));
    
    this.emit('catalog:loaded', this._products);
  }

  /**
   * Получить все товары
   */
  get catalog(): any[] {
    return this._products;
  }

  /**
   * Получить товары в корзине
   */
  get basket(): any[] {
    return this._basket;
  }

  /**
   * Получить текущий просматриваемый товар
   */
  get preview(): any | null {
    return this._preview;
  }

  /**
   * Получить данные заказа
   */
  get order(): any {
    return this._order;
  }

  /**
   * Получить товар по ID
   */
  getProductById(id: string): any | null {
    return this._products.find(item => item.id === id) || null;
  }

  /**
   * Добавить товар в корзину
   */
  addToBasket(product: any): void {
    // Находим товар в списке
    const existingProduct = this._products.find(item => item.id === product.id);
    
    if (existingProduct) {
      // Устанавливаем статус нахождения в корзине
      existingProduct.inBasket = true;
      
      // Проверяем, нет ли товара уже в корзине
      if (!this._basket.some(item => item.id === product.id)) {
        this._basket.push(existingProduct);
      }
      
      // Обновляем список идентификаторов товаров в заказе
      this._order.items = this._basket.map(item => item.id);
      
      // Обновляем общую сумму заказа
      this._order.total = this.getTotalPrice();
      
      // Оповещаем об изменении корзины
      this.emit('basket:changed', {
        count: this._basket.length,
        total: this._order.total
      });
    }
  }

  /**
   * Удалить товар из корзины
   */
  removeFromBasket(id: string): void {
    // Находим товар в списке
    const existingProduct = this._products.find(item => item.id === id);
    
    if (existingProduct) {
      // Устанавливаем статус нахождения в корзине
      existingProduct.inBasket = false;
      
      // Удаляем товар из корзины
      this._basket = this._basket.filter(item => item.id !== id);
      
      // Обновляем список идентификаторов товаров в заказе
      this._order.items = this._basket.map(item => item.id);
      
      // Обновляем общую сумму заказа
      this._order.total = this.getTotalPrice();
      
      // Оповещаем об изменении корзины
      this.emit('basket:changed', {
        count: this._basket.length,
        total: this._order.total
      });
    }
  }

  /**
   * Очистить корзину
   */
  clearBasket(): void {
    // Сбрасываем статус нахождения в корзине для всех товаров
    this._products.forEach(product => {
      if (product.inBasket) {
        product.inBasket = false;
      }
    });
    
    // Очищаем корзину
    this._basket = [];
    
    // Очищаем список идентификаторов товаров в заказе
    this._order.items = [];
    
    // Обновляем общую сумму заказа
    this._order.total = 0;
    
    // Оповещаем об изменении корзины
    this.emit('basket:changed', {
      count: 0,
      total: 0
    });
  }

  /**
   * Установить предпросматриваемый товар
   */
  setPreview(product: any | null): void {
    this._preview = product;
  }

  /**
   * Обновить данные заказа
   */
  updateOrder(data: any): void {
    this._order = {
      ...this._order,
      ...data
    };
  }

  /**
   * Очистить данные заказа
   */
  clearOrder(): void {
    this._order = {
      payment: 'card',
      address: '',
      email: '',
      phone: '',
      items: [],
      total: 0
    };
  }

  /**
   * Получить общую стоимость заказа
   */
  getTotalPrice(): number {
    return this._basket.reduce((sum, item) => sum + (item.price || 0), 0);
  }
}