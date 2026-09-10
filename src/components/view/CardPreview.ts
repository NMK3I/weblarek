import { CardWithImage } from "./CardWithImage";
import { ICardPreviewData, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardPreview extends CardWithImage<ICardPreviewData> {
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

		if (actions?.onClick) {
			this.buttonElement.addEventListener('click', actions.onClick);
		}
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	set buttonText(value: string) {
		this.buttonElement.textContent = value;
	}

	set buttonDisabled(value: boolean) {
		this.buttonElement.disabled = value;
	}
}