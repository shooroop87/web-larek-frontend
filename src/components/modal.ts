import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { IProduct, IOrderData, IOrderResult } from '../types';

/**
 * Базовый класс модального окна
 */
export abstract class Modal extends Component<HTMLElement> {
  protected closeButton: HTMLElement;
  protected contentElement: HTMLElement;
  protected _isOpen = false;

  constructor(
    protected container: HTMLElement, 
    protected eventEmitter?: EventEmitter
  ) {
    super(container);
    
    this.closeButton = this.container.querySelector('.modal__close') as HTMLElement;
    this.contentElement = this.container.querySelector('.modal__content') as HTMLElement;
    
    this.addEventListeners();
  }

  /**
   * Добавление обработчиков событий
   */
  private addEventListeners(): void {
    if (this.closeButton) {
      this.on(this.closeButton, 'click', this.close.bind(this));
    }
    
    this.on(this.container, 'click', this.handleOverlayClick.bind(this));
  }

  /**
   * Обработка клика по оверлею
   */
  private handleOverlayClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close();
    }
  }

  /**
   * Открытие модального окна
   */
  open(): void {
    this._isOpen = true;
    this.container.classList.add('modal_active');
    document.body.classList.add('page_no-scroll');
  }

  /**
   * Закрытие модального окна
   */
  close(): void {
    this._isOpen = false;
    this.container.classList.remove('modal_active');
    document.body.classList.remove('page_no-scroll');
  }

  /**
   * Проверка открыто ли модальное окно
   */
  isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Установка содержимого модального окна
   */
  setContent(content: HTMLElement): void {
    this.clear(this.contentElement);
    this.contentElement.append(content);
  }

  /**
   * Базовый метод рендеринга
   */
  render(data?: any): HTMLElement {
    return this.container;
  }
}

/**
 * Модальное окно с товаром
 */
export class ProductModal extends Modal {
  private productButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement, protected eventEmitter: EventEmitter) {
    super(container, eventEmitter);
  }

  /**
   * Установка статуса "в корзине"
   */
  setInBasket(inBasket: boolean): void {
    if (this.productButton) {
      this.productButton.textContent = inBasket ? 'Удалить' : 'В корзину';
      this.productButton.dataset.inBasket = String(inBasket);
    }
  }

  /**
   * Рендеринг модального окна товара
   */
  render(product: IProduct): HTMLElement {
    // Клонируем шаблон карточки
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    const cardElement = content.querySelector('.card') as HTMLElement;

    // Находим элементы
    const titleEl = cardElement.querySelector('.card__title') as HTMLElement;
    const imageEl = cardElement.querySelector('.card__image') as HTMLImageElement;
    const priceEl = cardElement.querySelector('.card__price') as HTMLElement;
    const categoryEl = cardElement.querySelector('.card__category') as HTMLElement;
    const descriptionEl = cardElement.querySelector('.card__text') as HTMLElement;
    this.productButton = cardElement.querySelector('.card__button') as HTMLButtonElement;

    // Заполняем данные
    this.setText(titleEl, product.title);
    this.setImage(imageEl, product.image, product.title);
    this.setText(priceEl, `${product.price ?? 'Бесценно'} синапсов`);
    this.setText(categoryEl, product.category);
    this.setText(descriptionEl, product.description);

    // Обработка кнопки добавления/удаления
    if (this.productButton) {
      this.productButton.dataset.id = product.id;
      this.on(this.productButton, 'click', () => {
        const inBasket = this.productButton?.dataset.inBasket === 'true';
        
        this.eventEmitter.emit(inBasket ? 'card:remove' : 'card:add', { id: product.id });
      });
    }

    // Устанавливаем содержимое
    this.setContent(cardElement);
    return this.container;
  }
}

/**
 * Модальное окно корзины
 */
export class BasketModal extends Modal {
  private basketList: HTMLElement | null = null;
  private totalElement: HTMLElement | null = null;
  private checkoutButton: HTMLButtonElement | null = null;

  constructor(
    container: HTMLElement, 
    private basketItemTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container, eventEmitter);
  }

  /**
   * Установка товаров в корзине
   */
  setItems(items: IProduct[]): void {
    if (!this.basketList) {
      this.basketList = this.container.querySelector('.basket__list') as HTMLElement;
    }

    this.clear(this.basketList);

    if (items.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.classList.add('basket__item', 'basket__item_empty');
      emptyMessage.textContent = 'Корзина пуста';
      this.basketList.append(emptyMessage);

      if (this.checkoutButton) this.checkoutButton.disabled = true;
    } else {
      items.forEach((item, index) => {
        const element = this.basketItemTemplate.content.cloneNode(true) as DocumentFragment;
        const basketItem = element.querySelector('.basket__item') as HTMLElement;
        
        // Установка данных
        basketItem.dataset.id = item.id;
        
        const indexEl = basketItem.querySelector('.basket__item-index') as HTMLElement;
        const titleEl = basketItem.querySelector('.card__title') as HTMLElement;
        const priceEl = basketItem.querySelector('.card__price') as HTMLElement;
        const deleteButton = basketItem.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.setText(indexEl, (index + 1).toString());
        this.setText(titleEl, item.title);
        this.setText(priceEl, `${item.price ?? 'Бесценно'} синапсов`);

        deleteButton.addEventListener('click', () => {
          this.eventEmitter.emit('card:remove', { id: item.id });
        });

        this.basketList.append(basketItem);
      });

      if (this.checkoutButton) this.checkoutButton.disabled = false;
    }
  }

  /**
   * Установка общей суммы
   */
  setTotal(total: number): void {
    if (!this.totalElement) {
      this.totalElement = this.container.querySelector('.basket__price') as HTMLElement;
    }
    this.setText(this.totalElement, `${total} синапсов`);
  }

  /**
   * Рендеринг корзины
   */
  render(items?: IProduct[]): HTMLElement {
    const template = document.querySelector('#basket') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    const basketContainer = content.querySelector('.basket') as HTMLElement;

    this.checkoutButton = basketContainer.querySelector('.basket__button') as HTMLButtonElement;
    this.checkoutButton.addEventListener('click', () => {
      this.eventEmitter.emit('order:open');
    });

    this.setContent(basketContainer);

    if (items && items.length > 0) {
      this.setItems(items);
    } else {
      this.setItems([]);
    }

    return this.container;
  }
}

/**
 * Модальное окно ввода адреса
 */
export class OrderAddressModal extends Modal {
  private formElement: HTMLFormElement | null = null;
  private addressInput: HTMLInputElement | null = null;
  private paymentButtons: HTMLButtonElement[] = [];
  private submitButton: HTMLButtonElement | null = null;

  constructor(
    container: HTMLElement, 
    private orderTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container, eventEmitter);
  }

  /**
   * Проверка валидности формы
   */
  private validateForm(): void {
    if (!this.addressInput || !this.submitButton) return;

    const isAddressFilled = this.addressInput.value.trim().length > 0;
    const isPaymentSelected = this.paymentButtons.some(
      button => button.classList.contains('button_alt_active')
    );

    this.submitButton.disabled = !(isAddressFilled && isPaymentSelected);
  }

  /**
   * Рендеринг формы адреса
   */
  render(data?: Partial<IOrderData>): HTMLElement {
    const content = this.orderTemplate.content.cloneNode(true) as DocumentFragment;
    const formContainer = content.querySelector('form') as HTMLFormElement;

    this.formElement = formContainer;
    this.addressInput = formContainer.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentButtons = Array.from(formContainer.querySelectorAll('.order__buttons button')) as HTMLButtonElement[];
    this.submitButton = formContainer.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Обработчики событий
    this.addressInput.addEventListener('input', () => this.validateForm());

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt_active'));
        button.classList.add('button_alt_active');
        this.validateForm();
      });
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.submitButton?.disabled) {
        const selectedPayment = this.paymentButtons.find(btn => 
          btn.classList.contains('button_alt_active')
        )?.name as 'card' | 'cash';

        this.eventEmitter.emit('order:address', {
          address: this.addressInput?.value,
          payment: selectedPayment
        });
      }
    });

    // Установка начальных данных, если есть
    if (data) {
      if (data.address) this.addressInput.value = data.address;
      if (data.payment) {
        this.paymentButtons.forEach(btn => 
          btn.classList.toggle('button_alt_active', btn.name === data.payment)
        );
      }
    }

    this.setContent(formContainer);
    this.validateForm();

    return this.container;
  }
}

/**
 * Модальное окно контактных данных
 */
export class OrderContactsModal extends Modal {
  private formElement: HTMLFormElement | null = null;
  private emailInput: HTMLInputElement | null = null;
  private phoneInput: HTMLInputElement | null = null;
  private submitButton: HTMLButtonElement | null = null;

  constructor(
    container: HTMLElement, 
    private contactsTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container, eventEmitter);
  }

  /**
   * Проверка валидности email
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Проверка валидности телефона
   */
  private isValidPhone(phone: string): boolean {
    return /^\+?[0-9\s\-\(\)]{10,}$/.test(phone);
  }

  /**
   * Проверка валидности формы
   */
  private validateForm(): void {
    if (!this.emailInput || !this.phoneInput || !this.submitButton) return;

    const isEmailValid = this.isValidEmail(this.emailInput.value);
    const isPhoneValid = this.isValidPhone(this.phoneInput.value);

    this.emailInput.classList.toggle('form__input_invalid', 
      !isEmailValid && this.emailInput.value.length > 0);
    this.phoneInput.classList.toggle('form__input_invalid', 
      !isPhoneValid && this.phoneInput.value.length > 0);

    this.submitButton.disabled = !(isEmailValid && isPhoneValid);
  }

  /**
   * Рендеринг формы контактов
   */
  render(data?: Partial<IOrderData>): HTMLElement {
    const content = this.contactsTemplate.content.cloneNode(true) as DocumentFragment;
    const formContainer = content.querySelector('form') as HTMLFormElement;

    this.formElement = formContainer;
    this.emailInput = formContainer.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = formContainer.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = formContainer.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Обработчики событий
    this.emailInput.addEventListener('input', () => this.validateForm());
    this.phoneInput.addEventListener('input', () => this.validateForm());

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.submitButton?.disabled) {
        this.eventEmitter.emit('order:contacts', {
          email: this.emailInput?.value,
          phone: this.phoneInput?.value
        });
      }
    });

    // Установка начальных данных, если есть
    if (data) {
      if (data.email) this.emailInput.value = data.email;
      if (data.phone) this.phoneInput.value = data.phone;
    }

    this.setContent(formContainer);
    this.validateForm();

    return this.container;
  }
}

/**
 * Модальное окно успешного заказа
 */
export class SuccessModal extends Modal {
  protected closeButton: HTMLButtonElement | null = null;
  private titleElement: HTMLElement | null = null;
  private descriptionElement: HTMLElement | null = null;

  constructor(
    container: HTMLElement,
    private successTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container, eventEmitter);
  }

  /**
   * Рендеринг модального окна успеха
   */
  render(data?: { orderId: string, total: number }): HTMLElement {
    const content = this.successTemplate.content.cloneNode(true) as DocumentFragment;
    const successElement = content.querySelector('.order-success') as HTMLElement;

    this.titleElement = successElement.querySelector('.order-success__title') as HTMLElement;
    this.descriptionElement = successElement.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;

    // Установка заголовка
    if (this.titleElement) {
      this.setText(this.titleElement, 'Заказ оформлен');
    }

    // Установка описания
    if (this.descriptionElement && data) {
      this.setText(this.descriptionElement, `Списано ${data.total} синапсов`);
    }

    // Обработчик закрытия
    if (this.closeButton) {
      this.on(this.closeButton, 'click', () => {
        this.eventEmitter.emit('success:close');
      });
    }

    // Устанавливаем содержимое
    this.setContent(successElement);
    return this.container;
  }
}