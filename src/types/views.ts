import { IOrder, IProduct } from './models';

/**
 * Интерфейс для базового компонента
 */
export interface IComponent<T> {
  render(data?: T): HTMLElement;
}

/**
 * Интерфейс для карточки товара
 */
export interface ICard extends IComponent<IProduct> {
  setButtonText(text: string): void;
}

/**
 * Интерфейс модального окна
 */
export interface IModal {
  open(): void;
  close(): void;
  render(data?: any): HTMLElement;
}

/**
 * Интерфейс формы
 */
export interface IForm<T> extends IComponent<T> {
  isValid(): boolean;
  getData(): T;
  setData(data: T): void;
}

/**
 * Интерфейс для корзины
 */
export interface IBasket extends IModal {
  setItems(items: IProduct[]): void;
  setTotal(total: number): void;
}