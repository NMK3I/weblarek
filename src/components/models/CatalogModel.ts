import { IProduct } from "../../types";

export class CatalogModel {
	private _items: IProduct[];
	private _preview: IProduct | null;

	constructor() {
		this._items = [];
		this._preview = null;
	}

	setItems(items: IProduct[]): void {
		this._items = items;
	}

	getItems(): IProduct[] {
		return this._items;
	}

	getItemById(id: string): IProduct | undefined {
		return this._items.find(item => item.id === id)
	}

	setPreview(item: IProduct | null): void {
		this._preview = item;
	}

	getPreview(): IProduct | null {
		return this._preview;
	}
}