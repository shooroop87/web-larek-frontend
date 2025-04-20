import { IEventHandlers, IProduct } from "../../types";
import { IEvents } from "../base/events";
import { Component } from "../base/Component";
import { CATEGORY_COLORS } from "../../utils/constants";

export interface IProductItemView {
  render(data: IProduct): HTMLElement;
}

export class ProductItemView extends Component<HTMLElement> implements IProductItemView {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IEventHandlers) {
    const element = template.content.querySelector(".card")!.cloneNode(true) as HTMLElement;
    super(element);
    this._cardElement = element;
    this._cardCategory = element.querySelector(".card__category")!;
    this._cardTitle = element.querySelector(".card__title")!;
    this._cardImage = element.querySelector(".card__image")!;
    this._cardPrice = element.querySelector(".card__price")!;

    if (actions?.onClick) {
      this._cardElement.addEventListener("click", actions.onClick);
    }
  }

  protected setText(element: HTMLElement, value: unknown): string | undefined {
    if (element) {
      return element.textContent = String(value);
    }
    return undefined;
  }

  set cardCategory(value: string) {
    this.setText(this._cardCategory, value);
    const colorClass = CATEGORY_COLORS[value] || "other";
    this._cardCategory.className = `card__category card__category_${colorClass}`;
  }

  protected setPrice(value: number | null): string {
    return value === null ? "Бесценно" : `${value} синапсов`;
  }

  render(data: IProduct): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = data.title;
    this._cardPrice.textContent = this.setPrice(data.price);
    return this._cardElement;
  }
}
