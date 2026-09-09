import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
	onClick: (e: MouseEvent) => void
}

export class Card extends Component<IProduct> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement
	protected buttonElement?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
		this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
		this.categoryElement = container.querySelector('.card__category') as HTMLElement;
		this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

		if (actions?.onClick) {
			if (this.buttonElement) {
				this.buttonElement.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		if (this.titleElement) {
			this.titleElement.textContent = value;
		}
	}

	set price(value: number | null) {
		if (this.priceElement) {
			this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
		}
	}

	set image(value: string) {
		if (this.imageElement) {
			const fullImageUrl = value.startsWith('http') ? value : `${CDN_URL}${value}`;
			this.setImage(this.imageElement, fullImageUrl, this.titleElement?.textContent || undefined);
		}
	}

	set category(value: string) {
		if (this.categoryElement) {
			this.categoryElement.textContent = value;

			const key = value as keyof typeof categoryMap;
			const categoryClass = categoryMap[key] || 'card__category_other';

			this.categoryElement.className = 'card__category';
			this.categoryElement.classList.add(categoryClass);
		}
	}
}

export class CardCatalog extends Card {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
	}
}

export class CardPreview extends Card {
	protected descriptionElement: HTMLElement;
	
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string) {
		if (this.descriptionElement) {
			this.descriptionElement.textContent = value;
		}
	}

	setButtonState(isInBasket: boolean, isPriceNull: boolean): void {
		if (!this.buttonElement) {
			return;
		}

		if (isPriceNull) {
			this.buttonElement.textContent = 'Недоступно';
			this.buttonElement.disabled = true;
		} else if (isInBasket) {
			this.buttonElement.textContent = 'Удалить из корзины';
			this.buttonElement.disabled = false;
		} else {
			this.buttonElement.textContent = 'Купить';
			this.buttonElement.disabled = false;
		}
	}
}

export class CardBasket extends Card {
	protected indexElement: HTMLElement

	constructor(container: HTMLElement, actions?: ICardActions)  {
		super(container, actions);
		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
	}

	set index(value: number) {
		if (this.indexElement) {
			this.indexElement.textContent = String(value);
		}
	}
}