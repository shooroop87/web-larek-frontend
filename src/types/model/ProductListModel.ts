import { IProduct } from '..';

export interface IProductListModel {
	products: IProduct[];

	getProducts(): IProduct[];
	getProduct(id: IProduct['id']): IProduct;
	setProducts(products: IProduct[]): IProduct[];
}