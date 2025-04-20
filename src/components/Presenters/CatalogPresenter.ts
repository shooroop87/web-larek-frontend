import { IEvents } from "../base/events";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";
import { WebLarekApi } from "../Services/WebLarekApi";
import { ProductDetailsView } from "../View/ProductDetailsView";
import { IProduct } from "../../types";

export class CatalogPresenter {
  constructor(
    private events: IEvents,
    private model: ProductCollectionModel,
    private api: WebLarekApi,
    private previewTemplate: HTMLTemplateElement
  ) {
    // Получение данных с сервера
    this.api.getProducts()
      .then(products => {
        this.model.products = products;
        this.events.emit("catalog:render", products);
      })
      .catch(error => console.error(error));

    // Открытие карточки в модалке
    this.events.on("modalCard:open", (item: IProduct) => {
      const details = new ProductDetailsView(this.previewTemplate, this.events);
      this.events.emit("modal:open", details.render(item));
    });
  }
}
