import { Component } from "../base/Component";
import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<IModalData> {
	protected closeButton: HTMLButtonElement;
	protected contentContainer: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);

		this.closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
	}

	set content(value: HTMLElement) {
		this.contentContainer.replaceChildren(value);
	}

	open(): void {
		this.container.classList.add('modal_active');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.contentContainer.replaceChildren();
	}
}