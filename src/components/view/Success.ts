import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected descriptionElement: HTMLElement;
	protected buttonClose: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
		this.buttonClose = ensureElement<HTMLButtonElement>('.order-success__close', container);

		this.buttonClose.addEventListener('click', () => {
			this.events.emit('order:clear');
		})
	}

	set total(value: number) {
		if (this.descriptionElement) {
			this.descriptionElement.textContent = `Списано ${value} синапсов`;
		}
	}
}