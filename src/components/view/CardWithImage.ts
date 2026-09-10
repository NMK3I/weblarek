import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export abstract class CardWithImage<T extends IProduct> extends Card<T> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
	}

	set image(value: string) {
		this.imageElement.src = value;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		const key = value as keyof typeof categoryMap;
		const categoryClass = categoryMap[key] ?? 'card__category_other';

		Object.values(categoryMap).forEach((cls) => this.categoryElement.classList.remove(cls));
		this.categoryElement.classList.add(categoryClass);
	}
}