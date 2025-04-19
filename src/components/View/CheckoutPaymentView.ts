import { IEvents } from "../base/events";

export interface ICheckoutPayment {
  formPayment: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: String;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

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
    
    this.buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('checkout:payment:select', item);
      });
    });
    
    this.formPayment.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`checkout:address:change`, { field, value });
    });
    
    this.formPayment.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('checkout:step:contacts');
    });
  }
  
  // устанавливаем обводку вокруг выбранного метода оплаты
  set paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }
  
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }
  
  render() {
    return this.formPayment
  }
}