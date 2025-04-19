import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

// Интерфейс для представления корзины с покупками
export interface IShoppingCartView {
  cartContainer: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  checkoutButton: HTMLButtonElement;
  cartTotal: HTMLElement;
  headerCartButton: HTMLButtonElement;
  headerCartCounter: HTMLElement;
  items: HTMLElement[];
  renderHeaderCartCounter(value: number): void;
  renderTotal(total: number): void;
  render(): HTMLElement;
}

// Класс для представления корзины с покупками
export class ShoppingCartView implements IShoppingCartView {
  cartContainer: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  checkoutButton: HTMLButtonElement;
  cartTotal: HTMLElement;
  headerCartButton: HTMLButtonElement;
  headerCartCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.cartContainer = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.cartContainer.querySelector('.modal__title');
    this.cartList = this.cartContainer.querySelector('.basket__list');
    this.checkoutButton = this.cartContainer.querySelector('.basket__button');
    this.cartTotal = this.cartContainer.querySelector('.basket__price');
    this.headerCartButton = document.querySelector('.header__basket');
    this.headerCartCounter = document.querySelector('.header__basket-counter');

    // Обработка клика оформления заказа
    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('checkout:step:payment');
    });

    // Обработка клика по иконке корзины
    this.headerCartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    });

    this.items = [];
  }

  // Список элементов корзины
  set items(items: HTMLElement[]) {
    if (items.length) {
      this.cartList.replaceChildren(...items);
      this.checkoutButton.removeAttribute('disabled');
    } else {
      this.checkoutButton.setAttribute('disabled', 'disabled');
      this.cartList.replaceChildren(
        createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })
      );
    }
  }

  // Отображение кол-ва товаров на корзине
  renderHeaderCartCounter(value: number) {
    this.headerCartCounter.textContent = String(value);
  }

  // Итоговая сумма заказа
  renderTotal(total: number) {
    this.cartTotal.textContent = String(total + ' синапсов');
  }

  // Рендерю корзину
  render() {
    this.title.textContent = 'Корзина';
    return this.cartContainer;
  }
}