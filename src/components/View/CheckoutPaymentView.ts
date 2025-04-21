import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ModalView } from "./ModalView";

export class CheckoutPaymentView extends Component<HTMLFormElement> {
  protected _submitButton: HTMLButtonElement;
  public formErrors: HTMLElement;

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    protected modal: ModalView
  ) {
    const form = template.content.querySelector("form")!.cloneNode(true) as HTMLFormElement;
    super(form);

    this._submitButton = form.querySelector(".order__button")!;
    this.formErrors = form.querySelector(".form__errors")!;

    // Кнопки выбора способа оплаты
    const buttons = form.querySelectorAll(".button_alt");

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("button_alt-active"));
        button.classList.add("button_alt-active");
        this.events.emit("checkout:payment:select", button);
      });
    });

    // Поле адреса доставки
    const addressInput = form.elements.namedItem("address");
    if (addressInput instanceof HTMLInputElement) {
      addressInput.addEventListener("input", (e: Event) => {
        this.events.emit("checkout:address:change", {
          field: "address",
          value: (e.target as HTMLInputElement).value,
        });
      });
    }

    // Отправка формы — переход к шагу 2
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("checkout:step:contacts");
    });

    this.events.on("checkout:payment:show", () => {
      this.modal.content = this.render();
      this.modal.render();
    });
  }

  // Управляет доступностью кнопки "Далее"
  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }
}
