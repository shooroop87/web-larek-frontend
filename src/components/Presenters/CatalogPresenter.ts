import { IEvents } from "../base/events";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";
import { WebLarekApi } from "../Services/WebLarekApi";
import { ProductDetailsView } from "../View/ProductDetailsView";
import { CatalogView } from "../View/CatalogView";
import { ProductItemView } from "../View/ProductItemView";
import { IProduct } from "../../types";

export class CatalogPresenter {
  constructor(
    private events: IEvents,
    private model: ProductCollectionModel,
    private api: WebLarekApi,
    private catalogView: CatalogView,
    private cardTemplate: HTMLTemplateElement,
    private previewTemplate: HTMLTemplateElement
  ) {
    // Получение данных с сервера
    this.api.getProducts()
      .then(products => {
        this.model.products = products;
      })
      .catch(error => console.error(error));

    // Подписка на событие получения продуктов от модели
    this.events.on("productCards:receive", () => {
      const cards = this.prepareProductCards(this.model.products);
      this.catalogView.renderCatalog(cards);
    });

    // Открытие карточки в модалке
    this.events.on("modalCard:open", (item: IProduct) => {
      const details = new ProductDetailsView(this.previewTemplate, this.events);
      this.events.emit("modal:open", details.render(item));
    });
    
    // Обработчик выбора товара для просмотра
    this.events.on("product:select", (item: IProduct) => {
      this.model.setPreview(item);
      this.events.emit("modalCard:open", item);
    });
  }

  // Подготовка карточек товаров для отображения
  private prepareProductCards(products: IProduct[]): HTMLElement[] {
    return products.map(item => {
      const card = new ProductItemView(this.cardTemplate, this.events, {
        onClick: () => {
          this.events.emit("product:select", item);
        }
      });
      return card.render(item);
    });
  }
}
