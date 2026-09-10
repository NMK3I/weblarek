import { Card } from "./Card";
import { ICardBasketData, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardBasket extends Card<ICardBasketData> {
	protected indexElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

		if (actions?.onClick) {
			this.buttonElement.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}
}