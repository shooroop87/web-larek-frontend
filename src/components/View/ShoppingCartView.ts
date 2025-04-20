import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Component";

export interface IShoppingCartView {
  renderHeaderCartCounter(value: number): void;
  renderTotal(total: number): void;
  render(): HTMLElement;
}

export class ShoppingCartView extends Component<HTMLElement> implements IShoppingCartView {
  cartContainer: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  checkoutButton: HTMLButtonElement;
  cartTotal: HTMLElement;
  headerCartButton: HTMLButtonElement;
  headerCartCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    const basket = template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    super(basket);

    this.cartContainer = basket;
    this.title = basket.querySelector('.modal__title')!;
    this.cartList = basket.querySelector('.basket__list')!;
    this.checkoutButton = basket.querySelector('.basket__button')!;
    this.cartTotal = basket.querySelector('.basket__price')!;
    this.headerCartButton = document.querySelector('.header__basket')!;
    this.headerCartCounter = document.querySelector('.header__basket-counter')!;

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

  renderHeaderCartCounter(value: number) {
    if (this.headerCartCounter) {
      this.headerCartCounter.textContent = String(value);
    }
  }

  renderTotal(total: number) {
    if (this.cartTotal) {
      this.cartTotal.textContent = `${total} синапсов`;
    }
  }

  render(): HTMLElement {
    this.title.textContent = 'Корзина';
    return this.cartContainer;
  }
}
