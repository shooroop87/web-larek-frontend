import { IProduct, IOrderData } from '../types';

export class AppState {
  private _catalog: IProduct[] = [];
  private _basket: IProduct[] = [];
  private _preview: IProduct | null = null;
  private _order: Partial<IOrderData> = {};

  /**
   * Получение каталога товаров
   */
  getCatalog(): IProduct[] {
    return this._catalog;
  }

  /**
   * Установка каталога товаров
   */
  setCatalog(items: IProduct[]): void {
    this._catalog = items;
  }

  /**
   * Получение товара по ID
   */
  getProductById(id: string): IProduct | undefined {
    return this._catalog.find(product => product.id === id);
  }

  /**
   * Получение корзины
   */
  getBasket(): IProduct[] {
    return this._basket;
  }

  /**
   * Получение текущего превью товара
   */
  getPreview(): IProduct | null {
    return this._preview;
  }

  /**
   * Установка превью товара
   */
  setPreview(product: IProduct): void {
    this._preview = product;
  }

  /**
   * Добавление товара в корзину
   */
  addToBasket(product: IProduct): void {
    if (!this._basket.some(item => item.id === product.id)) {
      this._basket.push({...product, inBasket: true});
      this.emitBasketChanged();
    }
  }

  /**
   * Удаление товара из корзины
   */
  removeFromBasket(id: string): void {
    this._basket = this._basket.filter(item => item.id !== id);
    this.emitBasketChanged();
  }

  /**
   * Получение общей стоимости товаров в корзине
   */
  getTotalPrice(): number {
    return this._basket.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  /**
   * Обновление информации о заказе
   */
  updateOrder(data: Partial<IOrderData>): void {
    this._order = { ...this._order, ...data };
  }

  /**
   * Получение текущего заказа
   */
  getOrder(): Partial<IOrderData> {
    return this._order;
  }

  /**
   * Очистка корзины
   */
  clearBasket(): void {
    this._basket = [];
    this.emitBasketChanged();
  }

  /**
   * Генерация события изменения корзины
   */
  private emitBasketChanged(): void {
    const event = new CustomEvent('basket:changed', { 
      detail: {
        count: this._basket.length,
        total: this.getTotalPrice()
      } 
    });
    document.dispatchEvent(event);
  }
}