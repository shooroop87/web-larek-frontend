import { IEvents } from "../base/events";
import { Component } from "../base/Component";

// Интерфейс для представления формы выбора оплаты
export interface ICheckoutPayment {
  formPayment: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: string;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class CheckoutPaymentView extends Component<HTMLElement> implements ICheckoutPayment {
  formPayment: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    const form = template.content.querySelector('.form')!.cloneNode(true) as HTMLFormElement;
    super(form);

    this.formPayment = form;
    this.buttonAll = Array.from(form.querySelectorAll('.button_alt'));
    this.buttonSubmit = form.querySelector('.order__button')!;
    this.formErrors = form.querySelector('.form__errors')!;

    // Обработка выбора способа оплаты
    this.buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        this.events.emit('checkout:payment:select', item);
      });
    });

    // Обработка ввода адреса
    form.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit('checkout:address:change', { field, value });
    });

    // Переход к следующему шагу в контакты
    form.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('checkout:step:contacts');
    });
  }

  set paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    });
  }

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.formPayment;
  }
}