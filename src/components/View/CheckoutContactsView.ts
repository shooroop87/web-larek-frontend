import { IEvents } from "../base/events";
import { Component } from "../base/Component";
import { ERROR_MESSAGES } from "../../utils/constants";

// Интерфейс для формы контактов
export interface IContacts {
  formContacts: HTMLFormElement;
  inputAll: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class CheckoutContactsView extends Component<unknown> implements IContacts {
  public formContacts: HTMLFormElement;
  public inputAll: HTMLInputElement[];
  public buttonSubmit: HTMLButtonElement;
  public formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    const element = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    super(element);

    this.formContacts = element;
    this.inputAll = Array.from(element.querySelectorAll(".form__input"));
    this.buttonSubmit = element.querySelector(".button") as HTMLButtonElement;
    this.formErrors = element.querySelector(".form__errors") as HTMLElement;

    // Обработка ввода
    this.inputAll.forEach((input) => {
      input.addEventListener("input", () => {
        this.clearErrors();
        this.validateInput(input);

        const field = input.name;
        const value = input.value;

        // emit событие для обновления модели
        this.events.emit("checkout:contacts:change", { field, value });
      });
    });

    // Обработка отправки формы
    element.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.events.emit("checkout:process:submit");
    });
  }

  // Валидатор активности кнопки
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  // Валидация конкретного инпута
  validateInput(input: HTMLInputElement): boolean {
    let error = "";

    if (!input.value.trim()) {
      error = ERROR_MESSAGES.required;
    } else if (input.name === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
      error = ERROR_MESSAGES.invalidEmail;
    } else if (input.name === "phone" && !/^\+?\d{10,15}$/.test(input.value)) {
      error = ERROR_MESSAGES.invalidPhone;
    }

    if (error) {
      this.formErrors.textContent = error;
      return false;
    }

    return true;
  }

  // Проверка всей формы
  validateForm(): boolean {
    return this.inputAll.every((input) => this.validateInput(input));
  }

  // Очистка ошибок
  clearErrors() {
    this.formErrors.textContent = "";
  }

  // Рендер
  render(): HTMLElement {
    return this.container;
  }
}
