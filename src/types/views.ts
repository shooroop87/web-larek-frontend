import { IProduct, ICartItem } from './models';

// Интерфейс карточки товара
export interface IProductCardView {
    render(product: IProduct): void;
    setActive(active: boolean): void;
    bindClick(handler: () => void): void;
}

// Интерфейс корзины
export interface ICartView {
    render(items: ICartItem[]): void;
    bindRemove(handler: (id: string) => void): void;
    show(): void;
    hide(): void;
}

// Интерфейс модального окна
export interface IModalView {
    setContent(content: HTMLElement): void;
    show(): void;
    hide(): void;
    bindClose(handler: () => void): void;
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