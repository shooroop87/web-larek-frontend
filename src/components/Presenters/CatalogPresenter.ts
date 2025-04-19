import { IEvents } from "../base/events";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";
import { WebLarekApi } from "../Services/WebLarekApi";

export class CatalogPresenter {
  constructor(
    private events: IEvents,
    private catalogModel: ProductCollectionModel,
    private api: WebLarekApi
  ) {
    // Получение товаров при инициализации
    this.api.getProducts()
      .then(products => {
        this.catalogModel.products = products;
      })
      .catch(error => console.error(error));

    // Обработка выбора товара
    this.events.on('catalog:product:select', (item) => {
      this.catalogModel.setPreview(item);
    });
  }
}