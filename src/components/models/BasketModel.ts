import { IProduct } from "../../types";

export class BasketModel {
	private _basketItems: IProduct[];

	constructor() {
		this._basketItems = [];
	}

	getBasketItems(): IProduct[] {
		return this._basketItems;
	}

	addBasketItem(item: IProduct): void {
		if (!this.isInBasket(item.id)) {
			this._basketItems.push(item);
		}
	}

	removeBasketItem(id: string): void {
		this._basketItems = this._basketItems.filter(item => item.id !== id);
	}

	clearBasket(): void {
		this._basketItems = [];
	}

	getTotalPrice(): number {
		return this._basketItems.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	getBasketCount(): number {
		return this._basketItems.length;
	}

	isInBasket(id: string): boolean {
		return this._basketItems.some(item => item.id === id);
	}
}