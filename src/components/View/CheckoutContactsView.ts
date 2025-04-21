import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ModalView } from "./ModalView";
import { ICheckoutForm } from "../../types";

export class CheckoutContactsView extends Component<HTMLFormElement> {
  protected _submitButton: HTMLButtonElement;
  public formErrors: HTMLElement;

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    protected modal: ModalView
  ) {
    const form = template.content.querySelector("form")!.cloneNode(true) as HTMLFormElement;
    super(form);

    this._submitButton = form.querySelector(".button")!;
    this.formErrors = form.querySelector(".form__errors")!;

    const emailInput = form.elements.namedItem("email");
    if (emailInput instanceof HTMLInputElement) {
      emailInput.addEventListener("input", (e) => {
        this.events.emit("checkout:contacts:change", {
          field: "email",
          value: (e.target as HTMLInputElement).value,
        });
      });
    }

    const phoneInput = form.elements.namedItem("phone");
    if (phoneInput instanceof HTMLInputElement) {
      phoneInput.addEventListener("input", (e) => {
        this.events.emit("checkout:contacts:change", {
          field: "phone",
          value: (e.target as HTMLInputElement).value,
        });
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("checkout:process:submit");
    });
  }

  showContacts(): void {
    this.modal.content = this.render();
    this.modal.render();
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  render(): HTMLElement {
    return this.container;
  }
}
