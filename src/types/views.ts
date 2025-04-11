import { IProduct, ICartItem } from './models';

// Интерфейс карточки товара
export interface IProductCardView extends IViewComponent<IProduct> {
    bindClick(handler: () => void): void;
    setActive(active: boolean): void;
}

// Интерфейс корзины
export interface ICartView extends IViewComponent<ICartItem[]> {
    bindRemove(handler: (id: string) => void): void;
    show(): void;
    hide(): void;
}

// Интерфейс модального окна
export interface IModalView extends IViewComponent<HTMLElement> {
    setContent(content: HTMLElement): void;
    bindClose(handler: () => void): void;
    show(): void;
    hide(): void;
}

// Интерфейс формы заказа
export interface IOrderFormView {
    renderStepOne(payment: string, address: string): void;
    renderStepTwo(email: string, phone: string): void;
    bindStepOneChange(handler: (data: { payment: string; address: string }) => void): void;
    bindStepTwoChange(handler: (data: { email: string; phone: string }) => void): void;
    bindSubmit(handler: () => void): void;
    showError(message: string): void;
    clear(): void;
}

// Интерфейс отображения компонента с универсальным типом данных
export interface IViewComponent<T> {
    render(data: T): HTMLElement;
    toggle(visible: boolean): void;
}