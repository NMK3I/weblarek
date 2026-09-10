import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IHeaderData } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Header extends Component<IHeaderData> {
	protected counterElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.counterElement.textContent = String(value);
	}
}