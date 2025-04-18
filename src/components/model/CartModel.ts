import { IProduct, IEventEmitter, Events } from '../../types';

export class CartModel {
	protected products: Map<IProduct['id'], IProduct>;
	protected totalPrice: number;

	constructor(protected events: IEventEmitter) {
		this.products = new Map();
		this.totalPrice = 0;
	}

	addProduct(product: IProduct): void {
		if (!this.products.has(product.id)) {
			this.products.set(product.id, product);
			this.totalPrice += product.price;
			this.events.emit(Events.CartChanged);
		}
	}

	removeProduct(id: IProduct['id']): void {
		this.totalPrice -= this.products.get(id).price;
		this.products.delete(id);
		this.events.emit(Events.CartChanged);
	}

	getProducts(): Map<IProduct['id'], IProduct> {
		return this.products;
	}

	getAmountOfProducts(): number {
		return this.products.size;
	}

	getTotalPrice(): number {
		return this.totalPrice;
	}

	clearCart(): void {
		this.products.clear();
		this.totalPrice = 0;
		this.events.emit(Events.CartChanged);
	}
}