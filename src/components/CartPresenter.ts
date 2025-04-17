import { AppState } from './AppState';
import { BasketModal } from './Modal';
import { EventEmitter } from './base/events';
import { IProduct } from '../types';

export class CartPresenter {
  constructor(
    private model: AppState,
    private view: BasketModal,
    private events: EventEmitter
  ) {
    // Подписываемся на события
    this.events.on('basket:open', this.openBasket.bind(this));
    this.events.on('order:open', this.prepareCheckout.bind(this));
  }

  // Открытие корзины
  private openBasket(): void {
    this.view.render(this.model.getBasket());
    this.view.setTotal(this.model.getTotalPrice());
    this.view.open();
  }

  // Подготовка к оформлению заказа
  private prepareCheckout(): void {
    // Проверяем, что корзина не пуста
    if (this.model.getBasket().length > 0) {
      this.view.close(); // Закрываем модальное окно корзины
      this.events.emit('order:start'); // Генерируем событие начала оформления заказа
    } else {
      // Показываем сообщение, что корзина пуста
      alert('Корзина пуста. Добавьте товары перед оформлением.');
    }
  }
}