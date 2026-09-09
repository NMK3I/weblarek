import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
	private items: IProduct[];
	private preview: IProduct | null;
	private events: IEvents;

	constructor(events: IEvents) {
		this.items = [];
		this.preview = null;
		this.events = events;
	}

	setItems(items: IProduct[]): void {
		this.items = items;
		this.events.emit('items:changed');
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getItemById(id: string): IProduct | undefined {
		return this.items.find(item => item.id === id)
	}

	setPreview(item: IProduct | null): void {
		this.preview = item;
		this.events.emit('preview:changed', item || undefined);
	}

	getPreview(): IProduct | null {
		return this.preview;
	}
}