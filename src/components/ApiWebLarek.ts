import { Api } from "./base/Api";
import { IOrder, IOrderResult, IApiProductsResponse } from "../types";

export class ApiWebLarek extends Api {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	async getProductList(): Promise<IApiProductsResponse> {
		const data = await this.get<IApiProductsResponse>('/product');
		return data;
	}

	async createOrder(order: IOrder): Promise<IOrderResult> {
		const result = await this.post<IOrderResult>('/order', order);
		return result;
	}
}