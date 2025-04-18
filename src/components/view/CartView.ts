import { Events, IEventEmitter } from '../../types';
import { ICartView } from '../../types/view/CartView';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';

export class CartView extends View<ICartView> {
	protected productList: HTMLElement;
	protected totalPriceElement: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter
	) {
		super(container);

		this.productList = ensureElement('.basket__list', this.container);
		this.totalPriceElement = ensureElement('.basket__price', this.container);
		this.submitButton = ensureElement(
			'.basket__button',
			this.container
		) as HTMLButtonElement;

		this.valid = false;

		this.submitButton.addEventListener('click', () => {
			events.emit(Events.FormOrder);
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	set products(products: HTMLElement[]) {
		this.productList.replaceChildren(...products);
	}

	set totalPrice(price: number) {
		this.setText(this.totalPriceElement, `${price} синапсов`);
	}	
}