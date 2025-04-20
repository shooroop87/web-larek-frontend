import { IEvents } from "../base/events";
import { CheckoutModel } from "../Model/CheckoutModel";
import { ShoppingCartModel } from "../Model/ShoppingCartModel";
import { WebLarekApi } from "../Services/WebLarekApi";
import { CheckoutPaymentView } from "../View/CheckoutPaymentView";
import { CheckoutContactsView } from "../View/CheckoutContactsView";
import { OrderSuccessView } from "../View/OrderSuccessView";
import { ShoppingCartView } from "../View/ShoppingCartView";
import { ModalView } from "../View/ModalView";
import { ICheckoutForm } from "../../types";

export class CheckoutPresenter {
  constructor(
    private events: IEvents,
    private checkoutModel: CheckoutModel,
    private cartModel: ShoppingCartModel,
    private api: WebLarekApi,
    private paymentView: CheckoutPaymentView,
    private contactsView: CheckoutContactsView,
    private successTemplate: HTMLTemplateElement,
    private modal: ModalView,
    private cartView?: ShoppingCartView
  ) {
    // Открытие модального окна выбора способа оплаты
    this.events.on('checkout:step:payment', () => {
      this.checkoutModel.items = this.cartModel.products.map(item => item.id);
      this.events.emit('modal:open', this.paymentView.render());
    });

    // Выбор способа оплаты
    this.events.on('checkout:payment:select', (button: HTMLButtonElement) => {
      this.checkoutModel.payment = button.name;
    });

    // Изменение адреса доставки
    this.events.on('checkout:address:change', (data: { field: string, value: string }) => {
      this.checkoutModel.setAddress(data.field, data.value);
    });

    // Валидация данных оплаты и адреса
    this.events.on('checkout:validation:address', (errors: Partial<ICheckoutForm>) => {
      const { address, payment } = errors;
      this.paymentView.valid = !address && !payment;
      this.paymentView.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
    });

    // Открытие модального окна контактной информации
    this.events.on('checkout:step:contacts', () => {
      this.checkoutModel.total = this.cartModel.getTotal();
      this.modal.content = this.contactsView.render();
      this.modal.render();
    });

    // Изменение контактных данных
    this.events.on('checkout:contacts:change', (data: { field: string, value: string }) => {
      this.checkoutModel.setContactData(data.field, data.value);
    });

    // Валидация контактных данных
    this.events.on('checkout:validation:contacts', (errors: Partial<ICheckoutForm>) => {
      const { email, phone } = errors;
      this.contactsView.valid = !email && !phone;
      this.contactsView.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
    });

    // Отправка заказа
    this.events.on('checkout:process:submit', () => {
      this.api.submitOrder(this.checkoutModel.getOrderData())
        .then((data) => {
          const successView = new OrderSuccessView(this.successTemplate);

          successView.setCloseHandler(() => {
            this.events.emit('order:success:close');
          });
      
          this.modal.content = successView.render({ total: this.cartModel.getTotal() });
          this.cartModel.clear();
          
          if (this.cartView) {
            this.cartView.renderHeaderCartCounter(this.cartModel.getItemCount());
          } else {
            this.events.emit('cart:counter:update', { count: this.cartModel.getItemCount() });
          }
          
          this.modal.render();
        })
        .catch(error => console.error(error));
    });

    // Закрытие окна успеха
    this.events.on('order:success:close', () => {
      this.modal.close();
    });
  }
}