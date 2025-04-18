export interface IFormContacts {
	email: HTMLInputElement;
	phone: HTMLInputElement;
	
	inputChangeHandler(field: keyof IFormContacts, value: string): void;
}