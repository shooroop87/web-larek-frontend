import { IEventEmitter } from '../../types';
import { IFormState } from '../../types/view/Form';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { View } from '../base/View';

export abstract class Form<T> extends View<IFormState> {
	protected errorElement: HTMLElement;
	protected submitButton: HTMLButtonElement;
	protected inputs: HTMLInputElement[];

	constructor(
		protected readonly container: HTMLFormElement,
		protected events: IEventEmitter
	) {
		super(container);

		this.errorElement = ensureElement('.form__errors', this.container);
		this.submitButton = ensureElement(
			'.button',
			this.container
		) as HTMLButtonElement;
		this.inputs = ensureAllElements('input', this.container);

		this.inputs.forEach((input) => {
			input.addEventListener('input', (e: Event) => {
				const target = e.target as HTMLInputElement;
				const field = target.name as keyof T;
				const value = target.value;
				this.inputChangeHandler(field, value);
			});
		});

		this.setDisabled(this.submitButton, true);
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	set errors(data: string) {
		this.setText(this.errorElement, data);
	}

	abstract inputChangeHandler(field: keyof T, value: string): void;

	render(data: Partial<T> & IFormState): HTMLElement {
		const { valid, errors, ...inputs } = data;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}

	clear() {
		this.container
			.querySelectorAll('input')
			.forEach((input) => (input.value = ''));
	}
}