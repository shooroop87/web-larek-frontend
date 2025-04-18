import { IEventEmitter, IProduct } from '../../types';
import { Category, ClickHandler } from '../../types/view/ProductView';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';

export class ProductView extends View<IProduct> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter,
		protected handler?: ClickHandler
	) {
		super(container);

		this.titleElement = ensureElement('.card__title', this.container);
		this.priceElement = ensureElement('.card__price', this.container);
	}

	set title(text: string) {
		this.setText(this.titleElement, text);
	}

	set price(value: number) {
		if (!value) this.setText(this.priceElement, 'Бесценно');
			else this.setText(this.priceElement, `${value} синапсов`);
	}
}

export class ProductViewList extends ProductView {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter,
		protected handler: ClickHandler
	) {
		super(container, events, handler);

		this.categoryElement = ensureElement('.card__category', this.container);
		this.imageElement = ensureElement('.card__image', this.container) as HTMLImageElement;

		this.container.addEventListener('click', handler);
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set category(value: string) {
		this.setText(this.categoryElement, value);
		this.categoryElement.classList.add(
			Category[value as keyof typeof Category]
		);
	}
}

export class ProductViewPreview extends ProductView {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected description: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter,
		protected handler: ClickHandler
	) {
		super(container, events, handler);

		this.categoryElement = ensureElement('.card__category', this.container);
		this.imageElement = ensureElement('.card__image', this.container) as HTMLImageElement;
		this.description = ensureElement('.card__text', this.container);
		this.button = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;

		this.button.addEventListener('click', handler);
	}

	set buttonText(text: string) {
		this.setText(this.button, text);
	}

	set buttonDisable(value: boolean) {
		this.setDisabled(this.button, value);
	}

	set image(src: string) {
		this.imageElement.src = src;
	}

	set category(value: string) {
		this.setText(this.categoryElement, value);
		this.categoryElement.classList.add(
			Category[value as keyof typeof Category]
		);
	}
}

export class ProductViewCart extends ProductView {
	protected button: HTMLButtonElement;
	protected indexElement: HTMLElement;

	constructor(
		protected readonly container: HTMLElement,
		protected events: IEventEmitter,
		protected handler: ClickHandler
	) {
		super(container, events, handler);

		this.indexElement = ensureElement('.basket__item-index', this.container);
		this.button = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;

		this.button.addEventListener('click', handler);
	}

	set index(index: number) {
		this.setText(this.indexElement, index);
	}
}