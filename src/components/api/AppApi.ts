import { OrderData } from '../../types';
import { Api } from '../base/api';
import { PostResponse, ProductsResponse } from '../../types/api/AppApi';

export class AppApi extends Api {
	constructor(readonly baseUrl: string, readonly cdn: string) {
		super(baseUrl);
	}

	getProducts(): Promise<ProductsResponse> {
		return this.get('/product').then((data: ProductsResponse) => {
			const updatedData = {
				...data,
				items: data.items.map((item) => {
					item.image = this.cdn + item.image;
					return item;
				}),
			};
			return updatedData;
		});
	}

	order(data: OrderData): Promise<PostResponse> {
		return this.post('/order', data) as Promise<PostResponse>;
	}
}