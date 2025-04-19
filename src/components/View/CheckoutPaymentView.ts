import { IEvents } from "../base/events";

// Интерфейс для представления формы выбора оплаты
export interface ICheckoutPayment {
  formPayment: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: string;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

// Класс для представления формы выбора способа оплаты
export class CheckoutPaymentView implements ICheckoutPayment {
  formPayment: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formPayment = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonAll = Array.from(this.formPayment.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.formPayment.querySelector('.order__button');
    this.formErrors = this.formPayment.querySelector('.form__errors');

    // Обработка выбора способа оплаты
    this.buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('checkout:payment:select', item);
      });
    });

    // Обработка ввода адреса
    this.formPayment.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`checkout:address:change`, { field, value });
    });

    // Переход к следующему шагу в контакты
    this.formPayment.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('checkout:step:contacts');
    });
  }

  // Выбор оплаты
  set paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    });
  }

  // Определяю валидность кнопки
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  // Рендерю форму
  render() {
    return this.formPayment;
  }
}