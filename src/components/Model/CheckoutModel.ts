import { IEvents } from '../base/events';
import { CheckoutFormErrors } from '../../types/index'

// Интерфейс, описывающий модель оформления заказа
export interface ICheckoutModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setAddress(field: string, value: string): void;
  validatePaymentStep(): boolean;
  setContactData(field: string, value: string): void;
  validateContactsStep(): boolean;
  getOrderData(): object;
}

// Класс модели оформления заказа
export class CheckoutModel implements ICheckoutModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: CheckoutFormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  // Адрес доставки
  setAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    if (this.validatePaymentStep()) {
      this.events.emit('checkout:payment:valid', this.getOrderData());
    }
  }

  // Валидация этапа оплаты
  validatePaymentStep() {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
    const errors: typeof this.formErrors = {};

    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    } else if (!regexp.test(this.address)) {
      errors.address = 'Укажите настоящий адрес';
    } else if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit('checkout:validation:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Контактные данные
  setContactData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    }

    if (this.validateContactsStep()) {
      this.events.emit('checkout:contacts:valid', this.getOrderData());
    }
  }

  // Валидация контактных данных
  validateContactsStep() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = 'Необходимо указать email';
    } else if (!regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты';
    }

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!regexpPhone.test(this.phone)) {
      errors.phone = 'Некорректный формат номера телефона';
    }

    this.formErrors = errors;
    this.events.emit('checkout:validation:contacts', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Получение всех данных заказа
  getOrderData() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    };
  }
}
