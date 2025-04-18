import { Events, IEventEmitter } from "../../types";
import { IPage } from "../../types/view/Page";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";

export class Page extends View<IPage> {
  protected productList: HTMLElement;
  protected cartButton: HTMLButtonElement;
  protected cartButtonCounter: HTMLElement;

  constructor(protected readonly container: HTMLElement, protected events: IEventEmitter) {
    super(container);

    this.productList = ensureElement('.gallery', this.container);
    this.cartButton = ensureElement('.header__basket', this.container) as HTMLButtonElement;
    this.cartButtonCounter = ensureElement('.header__basket-counter', this.container);

    this.cartButton.addEventListener('click', () => {
			events.emit(Events.CartOpen);
		});
  }

  set products(products: HTMLElement[]) {
		this.productList.replaceChildren(...products);
	}

  set cartCount(count: number) {
    this.setText(this.cartButtonCounter, count);
  }
}