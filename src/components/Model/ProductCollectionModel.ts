import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export interface IProductCollectionModel {
  products: IProduct[];
  selectedProduct: IProduct;
  setPreview(item: IProduct): void;
}

export class ProductCollectionModel implements IProductCollectionModel {
  protected _products: IProduct[];
  selectedProduct: IProduct;

  constructor(protected events: IEvents) {
    this._products = []
  }

  set products(data: IProduct[]) {
    this._products = data;
    this.events.emit('productCards:receive');
  }

  get products() {
    return this._products;
  }

  setPreview(item: IProduct) {
    this.selectedProduct = item;
    this.events.emit('modalCard:open', item)
  }
}