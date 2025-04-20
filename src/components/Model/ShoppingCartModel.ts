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

export interface ICartData {
  products: IProduct[];
  count: number; 
  total: number;
}

// Класс модели корзины
export class ShoppingCartModel implements IShoppingCartModel {
  protected _products: IProduct[];
  protected _events: IEvents;

  constructor(events: IEvents) {
    this._products = [];
    this._events = events;
  }

  get products(): IProduct[] {
    return this._products;
  }

  getItemCount(): number {
    return this._products.length;
  }

  getTotal(): number {
    return this._products.reduce((sum, item) => sum + item.price, 0);
  }

  addProduct(item: IProduct): void {
    this._products.push(item);
    this._events.emit('cart:changed', { products: this.products, count: this.getItemCount(), total: this.getTotal() });
  }

  removeProduct(item: IProduct): void {
    const index = this._products.findIndex((product) => product.id === item.id);
    if (index !== -1) {
      this._products.splice(index, 1);
      this._events.emit('cart:changed', { products: this.products, count: this.getItemCount(), total: this.getTotal() });
    }
  }

  clear(): void {
    this._products = [];
    this._events.emit('cart:changed', { products: this.products, count: 0, total: 0 });
  }
}