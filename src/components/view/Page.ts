import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected counterElement: HTMLElement;
	protected galleryElement: HTMLElement;
	protected wrapperElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
		this.galleryElement = ensureElement<HTMLElement>('.gallery', container);
		this.wrapperElement = ensureElement<HTMLElement>('.page__wrapper', container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		})
	}

	set counter(value: number) {
		if (this.counterElement) {
			this.counterElement.textContent = String(value);
		}
	}

	set catalog(cards: HTMLElement[]) {
		if (this.galleryElement) {
			this.galleryElement.replaceChildren(...cards);
		}
	}

	set locked(value: boolean) {
		if (this.wrapperElement) {
			if (value) {
				this.wrapperElement.classList.add('page__wrapper_locked');
			} else {
				this.wrapperElement.classList.remove('page__wrapper_locked');
			}
		}
	}
}