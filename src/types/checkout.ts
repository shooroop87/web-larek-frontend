// Интерфейс, описывающий форму оформления заказа
export interface ICheckoutForm {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
    total?: string | number;
}

// Интерфейс, описывающий данные заказа
export interface ICheckoutData extends ICheckoutForm {
    items: string[];
}

// Интерфейс, описывающий отправленные данные заказа
export interface ICheckoutSubmission {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

// Интерфейс, описывающий успешное оформления заказа
export interface ICheckoutResult {
    id: string;
    total: number;
}

export type CheckoutFormErrors = Partial<Record<keyof ICheckoutData, string>>;