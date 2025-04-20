import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { IProduct } from "../../types";
import { ProductItemView } from "./ProductItemView";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";

export class CatalogView extends Component<HTMLElement> {
  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected cardTemplate: HTMLTemplateElement,
    protected model: ProductCollectionModel
  ) {
    super(container);

    // Подписка на событие от презентера
    this.events.on("catalog:render", (products: IProduct[]) => {
      this.renderCatalog(products);
    });
  }

  renderCatalog(products: IProduct[]) {
    this.container.innerHTML = "";

    products.forEach((item) => {
      const card = new ProductItemView(this.cardTemplate, this.events, {
        onClick: () => {
          this.model.selectedProduct = item;
          this.events.emit("modalCard:open", item);
        }
      });

      this.container.append(card.render(item));
    });
  }
}
