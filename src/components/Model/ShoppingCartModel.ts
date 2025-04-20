
import { IProduct } from "../../types";
import { IEvents } from "../base/events";

// Интерфейс модели корзины
export interface IShoppingCartModel {
  products: IProduct[];
  getItemCount: () => number;
  getTotal: () => number;
  addProduct(data: IProduct): void;
  removeProduct(item: IProduct): void;
  clear(): void;
}

// Класс модели корзины
export class ShoppingCartModel implements IShoppingCartModel {
  protected _products: IProduct[];

  constructor(private events: IEvents) {
    this._products = [];
  }

  set products(data: IProduct[]) {
    this._products = data;
  }

  get products() {
    return this._products;
  }

  getItemCount() {
    return this.products.length;
  }

  getTotal() {
    return this.products.reduce((sum, item) => sum + item.price, 0);
  }

  addProduct(data: IProduct) {
    this._products.push(data);
    this.events.emit('cart:changed', this._products);
  }

  removeProduct(item: IProduct) {
    const index = this._products.indexOf(item);
    if (index >= 0) {
      this._products.splice(index, 1);
      this.events.emit('cart:changed', this._products);
    }
  }

  clear() {
    this.products = [];
    this.events.emit('cart:changed', this._products);
  }
}
