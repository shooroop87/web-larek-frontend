import { IEvents } from "../base/events";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";
import { WebLarekApi } from "../Services/WebLarekApi";
import { ProductItemView } from "../View/ProductItemView";
import { ProductDetailsView } from "../View/ProductDetailsView";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

export class CatalogPresenter {
  constructor(
    private events: IEvents,
    private model: ProductCollectionModel,
    private api: WebLarekApi,
    private cardTemplate: HTMLTemplateElement,
    private previewTemplate: HTMLTemplateElement
  ) {
    // Получение данных с сервера
    this.api.getProducts()
      .then(products => {
        this.model.products = products;
      })
      .catch(error => console.error(error));

    // Отображение карточек товара
    this.events.on('productCards:receive', () => {
      this.renderCatalog();
    });

    // Выбор товара
    this.events.on('catalog:product:select', (item: IProduct) => {
        this.model.setPreview(item);
    });

    // Открытие модального окна с деталями товара
    this.events.on('modalCard:open', (item: IProduct) => {
      const details = new ProductDetailsView(this.previewTemplate, this.events);
      this.events.emit('modal:open', details.render(item));
    });
  }

  private renderCatalog() {
    const container = ensureElement<HTMLElement>('.gallery');
    container.innerHTML = '';

    this.model.products.forEach(item => {
      const card = new ProductItemView(this.cardTemplate, this.events, {
        onClick: () => this.events.emit('catalog:product:select', item)
      });
      container.append(card.render(item));
    });
  }
}