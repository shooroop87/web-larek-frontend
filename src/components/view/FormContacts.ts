import { Events, IEventEmitter } from '../../types';
import { IFormContacts } from '../../types/view/FormContacts';
import { Form } from './Form';

export class FormContacts extends Form<IFormContacts> {
	email: HTMLInputElement;
	phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEventEmitter) {
		super(container, events);

		this.email = this.container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		this.phone = this.container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			events.emit(Events.OrderSubmit);
		});
	}

	set emailValue(value: string) {
		this.email.value = value;
	}

	set phoneValue(value: string) {
		this.phone.value = value;
	}

	inputChangeHandler(field: keyof IFormContacts, value: string) {
		this.events.emit(`contacts.${String(field)}:change`, {
			field,
			value,
		});
	}
}