import { IEvents } from "../base/events";
import { CheckoutModel } from "../Model/CheckoutModel";
import { ShoppingCartModel } from "../Model/ShoppingCartModel";
import { WebLarekApi } from "../Services/WebLarekApi";
import { CheckoutPaymentView } from "../View/CheckoutPaymentView";
import { CheckoutContactsView } from "../View/CheckoutContactsView";
import { ModalView } from "../View/ModalView";
import { ICheckoutForm } from "../../types";
import { ShoppingCartView } from "../View/ShoppingCartView";

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
    // Шаг 1: выбор способа оплаты
    this.events.on("checkout:step:payment", () => {
      this.checkoutModel.items = this.cartModel.products.map((item) => item.id);
      this.events.emit("checkout:payment:show");
    });

    this.events.on("checkout:payment:select", (button: HTMLButtonElement) => {
      this.checkoutModel.payment = button.name;
    });

    this.events.on("checkout:address:change", (data: { field: string; value: string }) => {
      this.checkoutModel.setAddress(data.field, data.value);
    });

    this.events.on("checkout:validation:address", (errors: Partial<ICheckoutForm>) => {
      const { address, payment } = errors;
      this.paymentView.valid = !address && !payment;
      this.paymentView.formErrors.textContent = Object.values({ address, payment })
        .filter(Boolean)
        .join("; ");
    });

    // Шаг 2: форма контактов
    this.events.on("checkout:step:contacts", () => {
      this.checkoutModel.total = this.cartModel.getTotal();
      this.events.emit("checkout:contacts:show");
    });

    this.events.on("checkout:contacts:change", (data: { field: string; value: string }) => {
      this.checkoutModel.setContactData(data.field, data.value);
    });

    this.events.on("checkout:validation:contacts", (errors: Partial<ICheckoutForm>) => {
      const { email, phone } = errors;
      this.contactsView.valid = !email && !phone;
      this.contactsView.formErrors.textContent = Object.values({ phone, email })
        .filter(Boolean)
        .join("; ");
    });

    // Обработка финального сабмита
    this.events.on("checkout:process:submit", () => {
      const isValid = this.checkoutModel.validateContactsStep();

      if (!isValid) {
        return;
      }

      this.api
        .submitOrder(this.checkoutModel.getOrderData())
        .then(() => {
          this.cartModel.clear();
          const total = this.checkoutModel.total;
          this.events.emit("checkout:success:show", { total });

          if (this.cartView) {
            this.cartView.renderHeaderCartCounter(0);
          } else {
            this.events.emit("cart:counter:update", { count: 0 });
          }
        })
        .catch((error) => console.error("Ошибка при отправке заказа:", error));
    });

    this.events.on("order:success:close", () => {
      this.modal.close();
    });
  }
}
