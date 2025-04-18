import { PaymentMethods } from "../view/FormOrder";

export type OrderModelTypes = {
	email: string;
	phone: string;
	paymentType: PaymentMethods;
	address: string;
};

export type FormErrors = Partial<Record<keyof OrderModelTypes, string>>;