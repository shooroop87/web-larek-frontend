import { IEvents } from '../base/events';
import { CheckoutFormErrors, ICheckoutSubmission } from '../../types';
import { ERROR_MESSAGES, REGEX } from '../../utils/constants';

export interface ICheckoutModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: CheckoutFormErrors;
  setAddress(field: string, value: string): void;
  validatePaymentStep(): boolean;
  setContactData(field: string, value: string): void;
  validateContactsStep(): boolean;
  getOrderData(): ICheckoutSubmission;
  update(field: string, value: string): void;
}

export class CheckoutModel implements ICheckoutModel {
  payment = '';
  email = '';
  phone = '';
  address = '';
  total = 0;
  items: string[] = [];
  formErrors: CheckoutFormErrors = {};

  constructor(protected events: IEvents) {}

  setAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    if (this.validatePaymentStep()) {
      this.events.emit('checkout:payment:valid', this.getOrderData());
    }
  }

  update(field: string, value: string): void {
    if (field === 'address') {
      this.address = value;
    } else if (field === 'payment') {
      this.payment = value;
    }

    const isValid = this.validatePaymentStep();

    if (isValid) {
      this.events.emit('checkout:payment:valid', this.getOrderData());
      this.events.emit('checkout:step:contacts');
    }

    this.events.emit('checkout:payment:validity', { valid: isValid });
  }

  validatePaymentStep(): boolean {
    const errors: typeof this.formErrors = {};

    if (!this.address) {
      errors.address = ERROR_MESSAGES.required;
    } else if (!REGEX.ADDRESS.test(this.address)) {
      errors.address = 'Укажите настоящий адрес';
    }

    if (!this.payment) {
      errors.payment = ERROR_MESSAGES.required;
    }

    this.formErrors = errors;
    this.events.emit('checkout:validation:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

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

  validateContactsStep(): boolean {
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = ERROR_MESSAGES.emailRequired;
    } else if (!REGEX.EMAIL.test(this.email)) {
      errors.email = ERROR_MESSAGES.emailInvalid;
    }

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    if (!this.phone) {
      errors.phone = ERROR_MESSAGES.phoneRequired;
    } else if (!REGEX.PHONE.test(this.phone)) {
      errors.phone = ERROR_MESSAGES.phoneInvalid;
    }

    this.formErrors = errors;
    this.events.emit('checkout:validation:contacts', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  getOrderData(): ICheckoutSubmission {
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