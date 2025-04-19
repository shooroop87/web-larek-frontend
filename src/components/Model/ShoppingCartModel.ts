import { IProduct } from "../../types";

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

  constructor() {
    this._products = [];
  }

  // Сеттер списка товаров
  set products(data: IProduct[]) {
    this._products = data;
  }

  // Текущий списка товаров в корзине
  get products() {
    return this._products;
  }

  // Кол-во товаров в корзине
  getItemCount() {
    return this.products.length;
  }

  // Расчет общей суммы товаров в корзине
  getTotal() {
    let total = 0;
    this.products.forEach(item => {
      total = total + item.price;
    });
    return total;
  }

  // Добавление товара в корзину
  addProduct(data: IProduct) {
    this._products.push(data);
  }

  // Удаление товара из корзины
  removeProduct(item: IProduct) {
    const index = this._products.indexOf(item);
    if (index >= 0) {
      this._products.splice(index, 1);
    }
  }

  // Очистка корзины
  clear() {
    this.products = [];
  }
}
