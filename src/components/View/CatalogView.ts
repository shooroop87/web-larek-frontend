import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class CatalogView extends Component<HTMLElement> {
  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected cardTemplate: HTMLTemplateElement
  ) {
    super(container);
  }

  renderCatalog(cards: HTMLElement[]) {
    this.container.replaceChildren(...cards);
  }
}
