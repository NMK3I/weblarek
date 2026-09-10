import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBasketView } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<IBasketView> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);

		this.listElement = ensureElement<HTMLElement>('.basket__list', container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
		this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.orderButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(cards: HTMLElement[]) {
		this.listElement.replaceChildren(...cards);
	}

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}

	set disabled(value: boolean) {
		this.orderButton.disabled = value;
	}
}