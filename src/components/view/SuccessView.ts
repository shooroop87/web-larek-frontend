import { Events, IEventEmitter } from '../../types';
import { SuccessData } from '../../types/view/SuccessView';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';

export class SuccessView extends View<SuccessData> {
	priceElement: HTMLElement;
	button: HTMLButtonElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter
	) {
		super(container);

		this.priceElement = ensureElement(
			'.order-success__total-price',
			this.container
		);
		this.button = ensureElement(
			'.order-success__close',
			this.container
		) as HTMLButtonElement;

		this.button.addEventListener('click', () => {
			this.events.emit(Events.ModalClose);
		});
	}

	set price(value: number) {
		this.setText(this.priceElement, value);
	}
}