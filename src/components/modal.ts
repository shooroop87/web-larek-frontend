import { Component } from './base/Component';
import { EventEmitter } from './base/events';

/**
 * Базовый класс модального окна
 */
export class Modal extends Component<any> {
  protected closeButton: HTMLElement;
  protected contentElement: HTMLElement;
  protected _isOpen: boolean = false;

  constructor(protected container: HTMLElement) {
    super(container);
    
    this.closeButton = container.querySelector('.modal__close') as HTMLElement;
    this.contentElement = container.querySelector('.modal__content') as HTMLElement;
    
    this.on(this.closeButton, 'click', this.close.bind(this));
    this.on(container, 'click', this.handleOverlayClick.bind(this));
  }

  /**
   * Обработчик клика по оверлею (вне контента)
   */
  private handleOverlayClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close();
    }
  }

  /**
   * Открыть модальное окно
   */
  open(): void {
    this._isOpen = true;
    this.container.classList.add('modal_active');
    document.body.classList.add('page_no-scroll');
  }

  /**
   * Закрыть модальное окно
   */
  close(): void {
    this._isOpen = false;
    this.container.classList.remove('modal_active');
    document.body.classList.remove('page_no-scroll');
  }

  /**
   * Проверка, открыто ли модальное окно
   */
  isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Установить содержимое модального окна
   */
  setContent(content: HTMLElement): void {
    this.clear(this.contentElement);
    this.contentElement.append(content);
  }

  /**
   * Отрисовать модальное окно
   */
  render(data?: any): HTMLElement {
    return this.container;
  }
}

/**
 * Класс модального окна с товаром
 */
export class ProductModal extends Modal {
  private cardElement: HTMLElement | null = null;
  private buttonElement: HTMLElement | null = null;
  
  constructor(container: HTMLElement, protected eventEmitter: EventEmitter) {
    super(container);
  }
  
  /**
   * Установить статус "в корзине"
   */
  setInBasket(inBasket: boolean): void {
    if (this.buttonElement) {
      this.buttonElement.textContent = inBasket ? 'Удалить' : 'В корзину';
      this.buttonElement.dataset.inBasket = String(inBasket);
    }
  }
  
  /**
   * Отрисовать модальное окно товара
   */
  render(product): HTMLElement {
    if (!product) return this.container;
    
    // Клонируем шаблон
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;
    const cardElement = content.querySelector('.card') as HTMLElement;
    
    // Сохраняем элемент карточки и кнопки
    this.cardElement = cardElement;
    this.buttonElement = cardElement.querySelector('.card__button');
    
    // Устанавливаем обработчик для кнопки
    if (this.buttonElement) {
      this.buttonElement.dataset.id = product.id;
      this.on(this.buttonElement, 'click', (event) => {
        const button = event.target as HTMLElement;
        const id = button.dataset.id;
        const inBasket = button.dataset.inBasket === 'true';
        
        if (id) {
          if (inBasket) {
            this.eventEmitter.emit('card:remove', id);
            button.textContent = 'В корзину';
            button.dataset.inBasket = 'false';
          } else {
            this.eventEmitter.emit('card:add', id);
            button.textContent = 'Удалить';
            button.dataset.inBasket = 'true';
          }
        }
      });
    }
    
    // Заполняем данные карточки
    const title = cardElement.querySelector('.card__title') as HTMLElement;
    const image = cardElement.querySelector('.card__image') as HTMLImageElement;
    const price = cardElement.querySelector('.card__price') as HTMLElement;
    const category = cardElement.querySelector('.card__category') as HTMLElement;
    const description = cardElement.querySelector('.card__text') as HTMLElement;
    
    this.setText(title, product.title);
    this.setImage(image, product.image, product.title);
    
    if (product.price === null) {
      this.setText(price, 'Бесценно');
    } else {
      this.setText(price, `${product.price} синапсов`);
    }
    
    if (category) {
      this.setText(category, product.category);
      category.className = 'card__category';
      // Преобразуем категорию для использования в имени класса
      const categoryClass = product.category
        .toLowerCase()
        .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
        .replace(/[^\w\-]/g, ''); // Удаляем все кроме букв, цифр, подчеркиваний и дефисов
        
      if (categoryClass) {
        category.classList.add(`card__category_${categoryClass}`);
      }
    }
    
    if (description && product.description) {
      this.setText(description, product.description);
    }
    
    if (this.buttonElement) {
      const inBasket = product.inBasket || false;
      this.buttonElement.textContent = inBasket ? 'Удалить' : 'В корзину';
      this.buttonElement.dataset.inBasket = String(inBasket);
    }
    
    // Устанавливаем содержимое модального окна
    this.setContent(cardElement);
    
    return this.container;
  }
}

/**
 * Класс модального окна корзины
 */
export class BasketModal extends Modal {
  private basketContent: HTMLElement | null = null;
  private basketList: HTMLElement | null = null;
  private totalElement: HTMLElement | null = null;
  private checkoutButton: HTMLElement | null = null;
  
  constructor(
    container: HTMLElement, 
    private basketItemTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container);
  }
  
  /**
   * Установить товары в корзине
   */
  setItems(items): void {
    if (!this.basketList) return;
    
    this.clear(this.basketList);
    
    if (items.length === 0) {
      // Если корзина пуста
      const emptyMessage = document.createElement('li');
      emptyMessage.classList.add('basket__item', 'basket__item_empty');
      emptyMessage.textContent = 'Корзина пуста';
      this.basketList.append(emptyMessage);
      
      if (this.checkoutButton) {
        this.checkoutButton.disabled = true;
      }
    } else {
      // Добавляем товары
      items.forEach((item, index) => {
        const element = this.basketItemTemplate.content.cloneNode(true) as DocumentFragment;
        const basketItem = element.querySelector('.basket__item') as HTMLElement;
        
        // Установка данных
        basketItem.dataset.id = item.id;
        
        // Установка индекса
        const indexElement = basketItem.querySelector('.basket__item-index') as HTMLElement;
        if (indexElement) {
          this.setText(indexElement, (index + 1).toString());
        }
        
        // Установка названия
        const titleElement = basketItem.querySelector('.card__title') as HTMLElement;
        if (titleElement) {
          this.setText(titleElement, item.title);
        }
        
        // Установка цены
        const priceElement = basketItem.querySelector('.card__price') as HTMLElement;
        if (priceElement) {
          if (item.price === null) {
            this.setText(priceElement, 'Бесценно');
          } else {
            this.setText(priceElement, `${item.price} синапсов`);
          }
        }
        
        // Добавление обработчика на кнопку удаления
        const deleteButton = basketItem.querySelector('.basket__item-delete') as HTMLElement;
        if (deleteButton) {
          this.on(deleteButton, 'click', () => {
            this.eventEmitter.emit('card:remove', item.id);
          });
        }
        
        this.basketList.append(basketItem);
      });
      
      if (this.checkoutButton) {
        this.checkoutButton.disabled = false;
      }
    }
  }
  
  /**
   * Установить общую сумму
   */
  setTotal(total: number): void {
    if (this.totalElement) {
      this.setText(this.totalElement, `${total} синапсов`);
    }
  }
  
  /**
   * Отрисовка корзины
   */
  render(items?): HTMLElement {
    // Клонируем шаблон
    const template = document.querySelector('#basket') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;
    
    // Сохраняем элементы корзины
    this.basketContent = content.querySelector('.basket') as HTMLElement;
    this.basketList = content.querySelector('.basket__list') as HTMLElement;
    this.totalElement = content.querySelector('.basket__price') as HTMLElement;
    this.checkoutButton = content.querySelector('.basket__button') as HTMLElement;
    
    // Добавляем обработчик на кнопку оформления
    if (this.checkoutButton) {
      this.on(this.checkoutButton, 'click', () => {
        this.eventEmitter.emit('order:open');
      });
    }
    
    // Устанавливаем содержимое модального окна
    this.setContent(this.basketContent);
    
    // Если есть товары, отображаем их
    if (items && items.length > 0) {
      this.setItems(items);
    } else {
      // Иначе показываем пустую корзину
      this.setItems([]);
    }
    
    return this.container;
  }
}

/**
 * Класс модального окна с формой заказа (адрес и способ оплаты)
 */
export class OrderAddressModal extends Modal {
  private formElement: HTMLFormElement | null = null;
  private addressInput: HTMLInputElement | null = null;
  private paymentButtons: Array<HTMLButtonElement> = [];
  private submitButton: HTMLButtonElement | null = null;
  
  constructor(
    container: HTMLElement, 
    private orderTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container);
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
   * Получение данных формы
   */
  private getData(): any {
    if (!this.addressInput) return {};
    
    const selectedButton = this.paymentButtons.find(
      button => button.classList.contains('button_alt_active')
    );
    
    return {
      address: this.addressInput.value.trim(),
      payment: selectedButton?.name || 'card'
    };
  }
  
  /**
   * Отрисовка формы
   */
  render(data?): HTMLElement {
    // Клонируем шаблон
    const content = this.orderTemplate.content.cloneNode(true) as HTMLElement;
    
    // Сохраняем элементы формы
    this.formElement = content.querySelector('form') as HTMLFormElement;
    this.addressInput = content.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentButtons = Array.from(content.querySelectorAll('.order__buttons button')) as HTMLButtonElement[];
    this.submitButton = content.querySelector('.order__button') as HTMLButtonElement;
    
    // Добавляем обработчики
    this.on(this.addressInput, 'input', () => this.validateForm());
    
    this.paymentButtons.forEach(button => {
      this.on(button, 'click', (event) => {
        const clickedButton = event.target as HTMLButtonElement;
        
        // Снимаем активное состояние со всех кнопок
        this.paymentButtons.forEach(btn => {
          btn.classList.remove('button_alt_active');
        });
        
        // Устанавливаем активное состояние на нажатую кнопку
        clickedButton.classList.add('button_alt_active');
        
        this.validateForm();
      });
    });
    
    // Устанавливаем обработчик отправки формы
    this.on(this.formElement, 'submit', (event) => {
      event.preventDefault();
      
      // Если форма валидна, отправляем данные
      if (!this.submitButton || !this.submitButton.disabled) {
        const formData = this.getData();
        this.eventEmitter.emit('order:address', formData);
      }
    });
    
    // Устанавливаем содержимое модального окна
    this.setContent(content.firstElementChild as HTMLElement);
    
    // Если есть данные, устанавливаем их
    if (data) {
      if (data.address && this.addressInput) {
        this.addressInput.value = data.address;
      }
      
      if (data.payment) {
        this.paymentButtons.forEach(button => {
          button.classList.toggle('button_alt_active', button.name === data.payment);
        });
      }
    }
    
    // По умолчанию устанавливаем способ оплаты "card"
    if (!data || !data.payment) {
      const cardButton = this.paymentButtons.find(button => button.name === 'card');
      if (cardButton) {
        cardButton.classList.add('button_alt_active');
      }
    }
    
    this.validateForm();
    import { Component } from './base/Component';
import { EventEmitter } from './base/events';

/**
 * Базовый класс модального окна
 */
export class Modal extends Component<any> {
  protected closeButton: HTMLElement;
  protected contentElement: HTMLElement;
  protected _isOpen: boolean = false;

  constructor(protected container: HTMLElement) {
    super(container);
    
    this.closeButton = container.querySelector('.modal__close') as HTMLElement;
    this.contentElement = container.querySelector('.modal__content') as HTMLElement;
    
    this.on(this.closeButton, 'click', this.close.bind(this));
    this.on(container, 'click', this.handleOverlayClick.bind(this));
  }

  /**
   * Обработчик клика по оверлею (вне контента)
   */
  private handleOverlayClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close();
    }
  }

  /**
   * Открыть модальное окно
   */
  open(): void {
    this._isOpen = true;
    this.container.classList.add('modal_active');
    document.body.classList.add('page_no-scroll');
  }

  /**
   * Закрыть модальное окно
   */
  close(): void {
    this._isOpen = false;
    this.container.classList.remove('modal_active');
    document.body.classList.remove('page_no-scroll');
  }

  /**
   * Проверка, открыто ли модальное окно
   */
  isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Установить содержимое модального окна
   */
  setContent(content: HTMLElement): void {
    this.clear(this.contentElement);
    this.contentElement.append(content);
  }

  /**
   * Отрисовать модальное окно
   */
  render(data?: any): HTMLElement {
    return this.container;
  }
}

/**
 * Класс модального окна с товаром
 */
export class ProductModal extends Modal {
  private cardElement: HTMLElement | null = null;
  private buttonElement: HTMLElement | null = null;
  
  constructor(container: HTMLElement, protected eventEmitter: EventEmitter) {
    super(container);
  }
  
  /**
   * Установить статус "в корзине"
   */
  setInBasket(inBasket: boolean): void {
    if (this.buttonElement) {
      this.buttonElement.textContent = inBasket ? 'Удалить' : 'В корзину';
      this.buttonElement.dataset.inBasket = String(inBasket);
    }
  }
  
  /**
   * Отрисовать модальное окно товара
   */
  render(product): HTMLElement {
    if (!product) return this.container;
    
    // Клонируем шаблон
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;
    const cardElement = content.querySelector('.card') as HTMLElement;
    
    // Сохраняем элемент карточки и кнопки
    this.cardElement = cardElement;
    this.buttonElement = cardElement.querySelector('.card__button');
    
    // Устанавливаем обработчик для кнопки
    if (this.buttonElement) {
      this.buttonElement.dataset.id = product.id;
      this.on(this.buttonElement, 'click', (event) => {
        const button = event.target as HTMLElement;
        const id = button.dataset.id;
        const inBasket = button.dataset.inBasket === 'true';
        
        if (id) {
          if (inBasket) {
            this.eventEmitter.emit('card:remove', id);
            button.textContent = 'В корзину';
            button.dataset.inBasket = 'false';
          } else {
            this.eventEmitter.emit('card:add', id);
            button.textContent = 'Удалить';
            button.dataset.inBasket = 'true';
          }
        }
      });
    }
    
    // Заполняем данные карточки
    const title = cardElement.querySelector('.card__title') as HTMLElement;
    const image = cardElement.querySelector('.card__image') as HTMLImageElement;
    const price = cardElement.querySelector('.card__price') as HTMLElement;
    const category = cardElement.querySelector('.card__category') as HTMLElement;
    const description = cardElement.querySelector('.card__text') as HTMLElement;
    
    this.setText(title, product.title);
    this.setImage(image, product.image, product.title);
    
    if (product.price === null) {
      this.setText(price, 'Бесценно');
    } else {
      this.setText(price, `${product.price} синапсов`);
    }
    
    if (category) {
      this.setText(category, product.category);
      category.className = 'card__category';
      // Преобразуем категорию для использования в имени класса
      const categoryClass = product.category
        .toLowerCase()
        .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
        .replace(/[^\w\-]/g, ''); // Удаляем все кроме букв, цифр, подчеркиваний и дефисов
        
      if (categoryClass) {
        category.classList.add(`card__category_${categoryClass}`);
      }
    }
    
    if (description && product.description) {
      this.setText(description, product.description);
    }
    
    if (this.buttonElement) {
      const inBasket = product.inBasket || false;
      this.buttonElement.textContent = inBasket ? 'Удалить' : 'В корзину';
      this.buttonElement.dataset.inBasket = String(inBasket);
    }
    
    // Устанавливаем содержимое модального окна
    this.setContent(cardElement);
    
    return this.container;
  }
}

/**
 * Класс модального окна корзины
 */
export class BasketModal extends Modal {
  private basketContent: HTMLElement | null = null;
  private basketList: HTMLElement | null = null;
  private totalElement: HTMLElement | null = null;
  private checkoutButton: HTMLElement | null = null;
  
  constructor(
    container: HTMLElement, 
    private basketItemTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container);
  }
  
  /**
   * Установить товары в корзине
   */
  setItems(items): void {
    if (!this.basketList) return;
    
    this.clear(this.basketList);
    
    if (items.length === 0) {
      // Если корзина пуста
      const emptyMessage = document.createElement('li');
      emptyMessage.classList.add('basket__item', 'basket__item_empty');
      emptyMessage.textContent = 'Корзина пуста';
      this.basketList.append(emptyMessage);
      
      if (this.checkoutButton) {
        this.checkoutButton.disabled = true;
      }
    } else {
      // Добавляем товары
      items.forEach((item, index) => {
        const element = this.basketItemTemplate.content.cloneNode(true) as DocumentFragment;
        const basketItem = element.querySelector('.basket__item') as HTMLElement;
        
        // Установка данных
        basketItem.dataset.id = item.id;
        
        // Установка индекса
        const indexElement = basketItem.querySelector('.basket__item-index') as HTMLElement;
        if (indexElement) {
          this.setText(indexElement, (index + 1).toString());
        }
        
        // Установка названия
        const titleElement = basketItem.querySelector('.card__title') as HTMLElement;
        if (titleElement) {
          this.setText(titleElement, item.title);
        }
        
        // Установка цены
        const priceElement = basketItem.querySelector('.card__price') as HTMLElement;
        if (priceElement) {
          if (item.price === null) {
            this.setText(priceElement, 'Бесценно');
          } else {
            this.setText(priceElement, `${item.price} синапсов`);
          }
        }
        
        // Добавление обработчика на кнопку удаления
        const deleteButton = basketItem.querySelector('.basket__item-delete') as HTMLElement;
        if (deleteButton) {
          this.on(deleteButton, 'click', () => {
            this.eventEmitter.emit('card:remove', item.id);
          });
        }
        
        this.basketList.append(basketItem);
      });
      
      if (this.checkoutButton) {
        this.checkoutButton.disabled = false;
      }
    }
  }
  
  /**
   * Установить общую сумму
   */
  setTotal(total: number): void {
    if (this.totalElement) {
      this.setText(this.totalElement, `${total} синапсов`);
    }
  }
  
  /**
   * Отрисовка корзины
   */
  render(items?): HTMLElement {
    // Клонируем шаблон
    const template = document.querySelector('#basket') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;
    
    // Сохраняем элементы корзины
    this.basketContent = content.querySelector('.basket') as HTMLElement;
    this.basketList = content.querySelector('.basket__list') as HTMLElement;
    this.totalElement = content.querySelector('.basket__price') as HTMLElement;
    this.checkoutButton = content.querySelector('.basket__button') as HTMLElement;
    
    // Добавляем обработчик на кнопку оформления
    if (this.checkoutButton) {
      this.on(this.checkoutButton, 'click', () => {
        this.eventEmitter.emit('order:open');
      });
    }
    
    // Устанавливаем содержимое модального окна
    this.setContent(this.basketContent);
    
    // Если есть товары, отображаем их
    if (items && items.length > 0) {
      this.setItems(items);
    } else {
      // Иначе показываем пустую корзину
      this.setItems([]);
    }
    
    return this.container;
  }
}

/**
 * Класс модального окна с формой заказа (адрес и способ оплаты)
 */
export class OrderAddressModal extends Modal {
  private formElement: HTMLFormElement | null = null;
  private addressInput: HTMLInputElement | null = null;
  private paymentButtons: Array<HTMLButtonElement> = [];
  private submitButton: HTMLButtonElement | null = null;
  
  constructor(
    container: HTMLElement, 
    private orderTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container);
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
   * Получение данных формы
   */
  private getData(): any {
    if (!this.addressInput) return {};
    
    const selectedButton = this.paymentButtons.find(
      button => button.classList.contains('button_alt_active')
    );
    
    return {
      address: this.addressInput.value.trim(),
      payment: selectedButton?.name || 'card'
    };
  }
  
  /**
   * Отрисовка формы
   */
  render(data?): HTMLElement {
    // Клонируем шаблон
    const content = this.orderTemplate.content.cloneNode(true) as HTMLElement;
    
    // Сохраняем элементы формы
    this.formElement = content.querySelector('form') as HTMLFormElement;
    this.addressInput = content.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentButtons = Array.from(content.querySelectorAll('.order__buttons button')) as HTMLButtonElement[];
    this.submitButton = content.querySelector('.order__button') as HTMLButtonElement;
    
    // Добавляем обработчики
    this.on(this.addressInput, 'input', () => this.validateForm());
    
    this.paymentButtons.forEach(button => {
      this.on(button, 'click', (event) => {
        const clickedButton = event.target as HTMLButtonElement;
        
        // Снимаем активное состояние со всех кнопок
        this.paymentButtons.forEach(btn => {
          btn.classList.remove('button_alt_active');
        });
        
        // Устанавливаем активное состояние на нажатую кнопку
        clickedButton.classList.add('button_alt_active');
        
        this.validateForm();
      });
    });
    
    // Устанавливаем обработчик отправки формы
    this.on(this.formElement, 'submit', (event) => {
      event.preventDefault();
      
      // Если форма валидна, отправляем данные
      if (!this.submitButton || !this.submitButton.disabled) {
        const formData = this.getData();
        this.eventEmitter.emit('order:address', formData);
      }
    });
    
    // Устанавливаем содержимое модального окна
    this.setContent(content.firstElementChild as HTMLElement);
    
    // Если есть данные, устанавливаем их
    if (data) {
      if (data.address && this.addressInput) {
        this.addressInput.value = data.address;
      }
      
      if (data.payment) {
        this.paymentButtons.forEach(button => {
          button.classList.toggle('button_alt_active', button.name === data.payment);
        });
      }
    }
    
    // По умолчанию устанавливаем способ оплаты "card"
    if (!data || !data.payment) {
      const cardButton = this.paymentButtons.find(button => button.name === 'card');
      if (cardButton) {
        cardButton.classList.add('button_alt_active');
      }
    }
    
    this.validateForm();
    
    return this.container;
  }
}

/**
 * Класс модального окна с формой контактов
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
    super(container);
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
   * Получение данных формы
   */
  private getData(): any {
    if (!this.emailInput || !this.phoneInput) return {};
    
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim()
    };
  }
  
  /**
   * Отрисовка формы
   */
  render(data?): HTMLElement {
    // Клонируем шаблон
    const content = this.contactsTemplate.content.cloneNode(true) as HTMLElement;
    
    // Сохраняем элементы формы
    this.formElement = content.querySelector('form') as HTMLFormElement;
    this.emailInput = content.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = content.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = content.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    // Добавляем обработчики
    this.on(this.emailInput, 'input', () => this.validateForm());
    this.on(this.phoneInput, 'input', () => this.validateForm());
    
    // Устанавливаем обработчик отправки формы
    this.on(this.formElement, 'submit', (event) => {
      event.preventDefault();
      
      // Если форма валидна, отправляем данные
      if (!this.submitButton || !this.submitButton.disabled) {
        const formData = this.getData();
        this.eventEmitter.emit('order:contacts', formData);
      }
    });
    
    // Устанавливаем содержимое модального окна
    this.setContent(content.firstElementChild as HTMLElement);
    
    // Если есть данные, устанавливаем их
    if (data) {
      if (data.email && this.emailInput) {
        this.emailInput.value = data.email;
      }
      
      if (data.phone && this.phoneInput) {
        this.phoneInput.value = data.phone;
      }
    }
    
    this.validateForm();
    
    return this.container;
  }
}

/**
 * Класс модального окна успешного оформления заказа
 */
export class SuccessModal extends Modal {
  private titleElement: HTMLElement | null = null;
  private descriptionElement: HTMLElement | null = null;
  private closeButton: HTMLElement | null = null;
  
  constructor(
    container: HTMLElement,
    private successTemplate: HTMLTemplateElement,
    protected eventEmitter: EventEmitter
  ) {
    super(container);
  }
  
  /**
   * Отрисовка окна успешного заказа
   */
  render(data?: any): HTMLElement {
    // Клонируем шаблон
    const content = this.successTemplate.content.cloneNode(true) as HTMLElement;
    const successElement = content.querySelector('.order-success') as HTMLElement;
    
    // Сохраняем элементы
    this.titleElement = successElement.querySelector('.order-success__title') as HTMLElement;
    this.descriptionElement = successElement.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = successElement.querySelector('.order-success__close') as HTMLElement;
    
    // Добавляем обработчик на кнопку
    if (this.closeButton) {
      this.on(this.closeButton, 'click', () => {
        this.eventEmitter.emit('success:close');
      });
    }
    
    // Устанавливаем содержимое модального окна
    this.setContent(successElement);
    
    // Если есть данные, устанавливаем их
    if (data) {
      if (this.titleElement) {
        this.setText(this.titleElement, 'Заказ оформлен');
      }
      
      if (this.descriptionElement && data.total) {
        this.setText(this.descriptionElement, `Списано ${data.total} синапсов`);
      }
    }
    
    return this.container;
  }
}
    return this.container;
  }
}

/**
 * Класс модального окна с формой контактов
 */
export class OrderContactsModal extends Modal {
  private formElement: HTMLFormElement | null = null;
  private emailInput: HTML