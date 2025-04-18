import { IEventEmitter } from '../../types';
import { IModalData } from '../../types/view/Modal';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';

export class Modal extends View<IModalData> {
	closeButton: HTMLElement;
	modalContent: HTMLElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter
	) {
		super(container);

		this.closeButton = ensureElement('.modal__close');
		this.modalContent = ensureElement('.modal__content');

		[this.closeButton, this.container].forEach((element) => {
			element.addEventListener('click', () => this.close());
		});
		this.modalContent.addEventListener('click', (e) => e.stopPropagation());
	}

	set content(data: HTMLElement) {
		this.modalContent.replaceChildren(data);
	}

	open(): void {
		this.container.classList.add('modal_active');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.content = null;
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}