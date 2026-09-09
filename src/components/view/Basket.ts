import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { createElement, ensureElement } from "../../utils/utils";

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.listElement = ensureElement<HTMLElement>('.basket__list', container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
		this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.orderButton.addEventListener('click', () => {
			this.events.emit('order:open');
		})

		this.items = [];
	}

	set items(cards: HTMLElement[]) {
		if (this.listElement) {
			if (cards.length > 0) {
				this.listElement.replaceChildren(...cards);
				this.orderButton.disabled = false;
			} else {
				this.listElement.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
				this.orderButton.disabled = true;
			}
		}
	}

	set total(value: number) {
		if (this.totalElement) {
			this.totalElement.textContent = `${value} синапсов`;
		}
	}
}