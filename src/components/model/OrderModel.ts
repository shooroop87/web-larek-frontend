import { Events, IEventEmitter } from '../../types';
import { FormErrors, OrderModelTypes } from '../../types/model/OrderModel';
import { PaymentMethods } from '../../types/view/FormOrder';

export class OrderModel {
	order: OrderModelTypes = {
		email: '',
		phone: '',
		paymentType: PaymentMethods.card,
		address: '',
	};

	formErrors: FormErrors = {};

	constructor(protected events: IEventEmitter) {
		this.events = events;
	}

	set payment(type: PaymentMethods) {
		this.order.paymentType = type;
		this.events.emit(Events.OrderModelPaymentMethod, { type: this.payment })
	}

	get payment(): PaymentMethods {
		return this.order.paymentType;
	}

	get address(): string {
		return this.order.address;
	}

	get email(): string {
		return this.order.email;
	}

	get phone(): string {
		return this.order.phone;
	}

	setFieldOrder<K extends keyof OrderModelTypes>(
		field: K,
		value: OrderModelTypes[K]
	): void {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit(Events.OrderValid);
		}
	}

	setFieldContacts<K extends keyof OrderModelTypes>(
		field: K,
		value: OrderModelTypes[K]
	): void {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit(Events.ContactsValid);
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit(Events.OrderError, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit(Events.ContactsError, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clear(): void {
		Object.keys(this.order).forEach((key: keyof OrderModelTypes) => {
			if (key === 'paymentType') {
				this.order.paymentType = PaymentMethods.card;
			} else {
				this.order[key] = '';
			}
		});
	}
}