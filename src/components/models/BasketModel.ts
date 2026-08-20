import { IProduct } from "../../types";

export class BasketModel {
	private basketItems: IProduct[];

	constructor() {
		this.basketItems = [];
	}

	getBasketItems(): IProduct[] {
		return this.basketItems;
	}

	addBasketItem(item: IProduct): void {
		if (!this.isInBasket(item.id)) {
			this.basketItems.push(item);
		}
	}

	removeBasketItem(id: string): void {
		this.basketItems = this.basketItems.filter(item => item.id !== id);
	}

	clearBasket(): void {
		this.basketItems = [];
	}

	getTotalPrice(): number {
		return this.basketItems.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	getBasketCount(): number {
		return this.basketItems.length;
	}

	isInBasket(id: string): boolean {
		return this.basketItems.some(item => item.id === id);
	}
}