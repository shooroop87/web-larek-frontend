import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { CartItemView } from "./CartItemView";

export interface IShoppingCartView {
  renderHeaderCartCounter(value: number): void;
  renderTotal(total: number): void;
  updateCartItems(products: IProduct[], template: HTMLTemplateElement): void;
  render(): HTMLElement;
}

export class ShoppingCartView extends Component<HTMLElement> implements IShoppingCartView {
  cartContainer: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  checkoutButton: HTMLButtonElement;
  cartTotal: HTMLElement;
  private _emptyCartElement: HTMLParagraphElement;

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    protected headerCartButton: HTMLButtonElement,
    protected headerCartCounter: HTMLElement
  ) {
    const basket = template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    super(basket);

    this.cartContainer = basket;
    this.title = basket.querySelector('.modal__title')!;
    this.cartList = basket.querySelector('.basket__list')!;
    this.checkoutButton = basket.querySelector('.basket__button')!;
    this.cartTotal = basket.querySelector('.basket__price')!;

    // Создаем элемент для пустой корзины заранее
    this._emptyCartElement = createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' });

    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('checkout:step:payment');
    });

    this.headerCartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }

  updateCartItems(products: IProduct[], template: HTMLTemplateElement): void {
    const cartItems = products.map((item, index) => {
      const cartItem = new CartItemView(template, this.events, {
        onClick: () => this.events.emit("cart:item:remove", item),
      });
      return cartItem.renderCartItem(item, index + 1);
    });
    
    this.items = cartItems;
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.cartList.replaceChildren(...items);
      this.checkoutButton.removeAttribute('disabled');
    } else {
      this.checkoutButton.setAttribute('disabled', 'disabled');
      // Используем заранее созданный элемент
      this.cartList.replaceChildren(this._emptyCartElement);
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
