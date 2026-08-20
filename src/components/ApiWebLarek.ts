import { IApi, IOrder, IOrderResult, IApiProductsResponse } from "../types";

export class ApiWebLarek {
	private api: IApi;

	constructor(api: IApi) {
		this.api = api;
	}

	getProductList(): Promise<IApiProductsResponse> {
		return this.api.get<IApiProductsResponse>('/product');
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.api.post<IOrderResult>('/order', order);
	}
}