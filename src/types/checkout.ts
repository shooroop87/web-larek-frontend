export interface ICheckoutForm {
    payment?: string;
    address?: string;
    phone?: string;
    email?: string;
    total?: string | number;
}

export interface ICheckoutData extends ICheckoutForm {
    items: string[];
}

export interface ICheckoutSubmission {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
  
export interface ICheckoutResult {
    id: string;
    total: number;
}

export type CheckoutFormErrors = Partial<Record<keyof ICheckoutData, string>>;