import { IProduct } from "../../types";
import { IEvents } from "../base/events";

// Интерфейс для модели коллекции товаров
export interface IProductCollectionModel {
  products: IProduct[];
  selectedProduct: IProduct;
  setPreview(item: IProduct): void;
}

// Класс модели коллекции товаров
export class ProductCollectionModel implements IProductCollectionModel {
  protected _products: IProduct[];
  selectedProduct: IProduct;

  constructor(protected events: IEvents) {
    this._products = [];
  }

  // Сеттер для списка товаров
  set products(data: IProduct[]) {
    this._products = data;
    this.events.emit('productCards:receive');
  }

  // Геттер для списка товаров
  get products() {
    return this._products;
  }

  // Открытие модального окна
  setPreview(item: IProduct) {
    this.selectedProduct = item;
    this.events.emit('modalCard:open', item);
  }
}