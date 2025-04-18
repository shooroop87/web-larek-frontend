import { IProduct } from '..';

export type ProductsResponse = {
	total: number;
	items: IProduct[];
};

export type PostResponse = {
	id?: string;
	total?: number;
	error?: string;
};

export interface IOrderApi {}