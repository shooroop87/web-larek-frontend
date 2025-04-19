import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

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
    
    // При клике на кнопку оформления заказа генерируем событие
    this.checkoutButton.addEventListener('click', () => { 
      this.events.emit('checkout:step:payment');
    });
    
    // При клике на иконку корзины в шапке генерируем событие
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
      this.cartList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }
  
  renderHeaderCartCounter(value: number) {
    this.headerCartCounter.textContent = String(value);
  }
  
  renderTotal(total: number) {
    this.cartTotal.textContent = String(total + ' синапсов');
  }
  
  render() {
    this.title.textContent = 'Корзина';
    return this.cartContainer;
  }
}