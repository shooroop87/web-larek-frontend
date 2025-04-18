export type FormOrderData = {
	address: string;
	payment: PaymentMethods;
};

export enum PaymentMethods {
	card = 'card',
	cash = 'cash',
}

export interface IFormOrder {
	deliveryAddress: HTMLElement;
	buttonsContainer: HTMLElement;
	buttonCash: HTMLButtonElement;
	buttonCard: HTMLButtonElement;

	inputChangeHandler(field: keyof IFormOrder, value: string): void;
}