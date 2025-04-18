import { PaymentMethods } from "./view/FormOrder";

type Categories =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type IProduct = {
	title: string;
	image: string;
	category: Categories;
	description: string;
	price: number;
	id: string;
};

export interface IEventEmitter {
	emit<T extends object>(event: string, data?: T): void;
}

export type EventDataId = {
	id: string;
};

export enum Events {
	OrderSubmit = 'order:submit',
	OrderError = 'order:error',
	OrderFormPaymentMethod = 'order:formPaymentMethod',
	OrderModelPaymentMethod = 'order:modelPaymentMethod',
	OrderValid = 'order:valid',
	ContactsValid = 'contacts:valid',
	ContactsError = 'contacts:error',
	CartOpen = 'cart:open',
	CartChanged = 'cart:changed',
	FormOrder = 'form:order',
	FormContacts = 'form:contacts',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	ProductListSet = 'productList:set',
	ProductClick = 'product:click',
	ProductAdd = 'product:add',
	ProductDelete = 'product:delete',
}

export type OrderData = {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethods;
	items: string[];
	total: number;
};