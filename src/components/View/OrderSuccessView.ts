import { Component } from "../base/Component";

interface ISuccessViewModel {
  total: number;
}

export class OrderSuccessView extends Component<ISuccessViewModel> {
  protected title: HTMLElement;
  protected description: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    const container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(container);

    this.title = container.querySelector(".order-success__title") as HTMLElement;
    this.description = container.querySelector(".order-success__description") as HTMLElement;
    this.button = container.querySelector(".order-success__close") as HTMLButtonElement;
  }

  render(data?: Partial<ISuccessViewModel>): HTMLElement {
    this.setText(this.description, `Списано ${data?.total ?? 0} синапсов`);
    return this.container;
  }

  setCloseHandler(callback: () => void): void {
    this.button.addEventListener("click", callback);
  }
}
