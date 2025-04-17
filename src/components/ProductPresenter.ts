import { AppState } from './AppState';
import { ProductModal } from './Modal';
import { EventEmitter } from './base/events';
import { IProduct } from '../types';

export class ProductPresenter {
  constructor(
    private model: AppState,
    private view: ProductModal,
    private events: EventEmitter
  ) {
    // Подписываемся на события
    this.events.on('card:select', this.openProductDetails.bind(this));
    this.events.on('card:add', this.addToCart.bind(this));
    this.events.on('card:remove', this.removeFromCart.bind(this));
  }

  // Открытие детальной информации о товаре
  private openProductDetails(product: IProduct): void {
    this.model.setPreview(product);
    this.view.render(product);
    this.view.setInBasket(product.inBasket || false);
    this.view.open();
  }

  // Добавление товара в корзину
  private addToCart({ id }: { id: string }): void {
    const product = this.model.getProductById(id);
    if (product) {
      this.model.addToBasket(product);
      
      // Обновляем статус в модальном окне, если это текущий товар
      const preview = this.model.getPreview();
      if (preview?.id === id) {
        this.view.setInBasket(true);
      }
    }
  }

  // Удаление товара из корзины
  private removeFromCart({ id }: { id: string }): void {
    this.model.removeFromBasket(id);
    
    // Обновляем статус в модальном окне, если это текущий товар
    const preview = this.model.getPreview();
    if (preview?.id === id) {
      this.view.setInBasket(false);
    }
  }
}