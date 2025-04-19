import { IEvents } from "../base/events";
import { CheckoutModel } from "../Model/CheckoutModel";
import { ShoppingCartModel } from "../Model/ShoppingCartModel";
import { WebLarekApi } from "../Services/WebLarekApi";

export class CheckoutPresenter {
  constructor(
    private events: IEvents,
    private checkoutModel: CheckoutModel,
    private cartModel: ShoppingCartModel,
    private api: WebLarekApi
  ) {
    // Начало оформления заказа
    this.events.on('checkout:step:payment', () => {
      this.checkoutModel.items = this.cartModel.products.map(item => item.id);
      this.events.emit('checkout:render:payment');
    });

    // Выбор способа оплаты
    this.events.on('checkout:payment:select', (button) => {
      this.checkoutModel.payment = button.name;
    });

    // Изменение адреса
    this.events.on('checkout:address:change', (data) => {
      this.checkoutModel.setAddress(data.field, data.value);
    });

    // Переход к контактным данным
    this.events.on('checkout:step:contacts', () => {
      this.checkoutModel.total = this.cartModel.getTotal();
      this.events.emit('checkout:render:contacts');
    });

    // Изменение контактных данных
    this.events.on('checkout:contacts:change', (data) => {
      this.checkoutModel.setContactData(data.field, data.value);
    });

    // Отправка заказа
    this.events.on('checkout:process:submit', () => {
      this.api.submitOrder(this.checkoutModel.getOrderData())
        .then((data) => {
          console.log('Order submitted:', data);
          this.events.emit('order:success', this.cartModel.getTotal());
          this.cartModel.clear();
          this.events.emit('cart:counter:update', 0);
        })
        .catch(error => console.error('Order submission error:', error));
    });
  }
}