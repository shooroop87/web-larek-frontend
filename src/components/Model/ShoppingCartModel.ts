import { IProduct } from "../../types";

export interface IShoppingCartModel {
  products: IProduct[];
  getItemCount: () => number;
  getTotal: () => number;
  addProduct(data: IProduct): void;
  removeProduct(item: IProduct): void;
  clear(): void
}

export class ShoppingCartModel implements IShoppingCartModel {
  protected _products: IProduct[]; // список товаров в корзине

  constructor() {
    this._products = [];
  }

  set products(data: IProduct[]) {
    this._products = data;
  }

  get products() {
    return this._products;
  }

  // количество товаров в корзине
  getItemCount() {
    return this.products.length;
  }

  // общая сумма товаров в корзине
  getTotal() {
    let total = 0;
    this.products.forEach(item => {
      total = total + item.price;
    });
    return total;
  }

  // добавить товар в корзину
  addProduct(data: IProduct) {
    this._products.push(data);
  }

  // удалить товар из корзины
  removeProduct(item: IProduct) {
    const index = this._products.indexOf(item);
    if (index >= 0) {
      this._products.splice(index, 1);
    }
  }

  clear() {
    this.products = []
  }
}