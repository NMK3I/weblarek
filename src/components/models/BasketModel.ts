import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
	private basketItems: IProduct[];
	private events: IEvents;

	constructor(events: IEvents) {
		this.basketItems = [];
		this.events = events;
	}

	getBasketItems(): IProduct[] {
		return this.basketItems;
	}

	addBasketItem(item: IProduct): void {
		if (!this.isInBasket(item.id)) {
			this.basketItems.push(item);
			this.events.emit('basket:changed');
		}
	}

	removeBasketItem(id: string): void {
		this.basketItems = this.basketItems.filter(item => item.id !== id);
		this.events.emit('basket:changed');
	}

	clearBasket(): void {
		this.basketItems = [];
		this.events.emit('basket:changed');
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