import { Events, IEventEmitter } from '../../types';
import { IFormOrder, PaymentMethods } from '../../types/view/FormOrder';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

function isPaymentType(str: string): str is PaymentMethods {
	return str === PaymentMethods.cash || str === PaymentMethods.card;
}

export class FormOrder extends Form<IFormOrder> {
	deliveryAddress: HTMLInputElement;
	buttonsContainer: HTMLElement;
	buttonCash: HTMLButtonElement;
	buttonCard: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEventEmitter) {
		super(container, events);

		this.buttonsContainer = ensureElement('.order__buttons', this.container);
		this.buttonCard = ensureElement('[name="card"]', this.container) as HTMLButtonElement;
		this.buttonCash = ensureElement('[name="cash"]', this.container) as HTMLButtonElement;
		this.deliveryAddress = ensureElement(
			'.form__input',
			this.container
		) as HTMLInputElement;

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			events.emit(Events.FormContacts);
		});

		this.buttonsContainer.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('button_alt')) {
				const button = target as HTMLButtonElement;
				const type = isPaymentType(button.name) ? button.name : undefined;
				this.events.emit(Events.OrderFormPaymentMethod, { type });
			}
		});
	}

	set deliveryAddressValue(value: string) {
		this.deliveryAddress.value = value;
	}

	set paymentType(type: PaymentMethods) {
		[this.buttonCard, this.buttonCash].forEach((button) => {
			if (button.name === type) {
				this.toggleClass(button, 'button_alt-active', true);
			} else {
				this.toggleClass(button, 'button_alt-active', false);
			} 
		});
	}

	inputChangeHandler(field: keyof IFormOrder, value: string) {
		this.events.emit(`order.${String(field)}:change`, {
			field,
			value,
		});
	}
}