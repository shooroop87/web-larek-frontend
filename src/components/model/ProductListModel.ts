import { IProduct, IEventEmitter } from '../../types';
import { Events } from '../../types';

export class ProductListModel {
	protected products: IProduct[];

	constructor(protected events: IEventEmitter) {
		this.events = events;
	}

	getProducts(): IProduct[] {
		return this.products;
	}

	setProducts(products: IProduct[]): IProduct[] {
		this.products = products;
		this.events.emit(Events.ProductListSet, this.products);
		return this.products;
	}
}