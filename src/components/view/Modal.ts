import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	private closeButton: HTMLButtonElement;
	private contentContainer: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);

		this.closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', () => this.close());
		this.contentContainer.addEventListener('click', (e) => e.stopPropagation());
	}

	set content(value: HTMLElement) {
		if (this.contentContainer) {
			this.contentContainer.replaceChildren(value);
		}
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');

		if (this.contentContainer) {
			this.contentContainer.replaceChildren();
		}
		
		this.events.emit('modal:close');
	}

	render(data?: Partial<IModalData>): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}