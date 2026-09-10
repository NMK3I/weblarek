import { CardWithImage } from "./CardWithImage";
import { IProduct, ICardActions } from "../../types";

export class CardCatalog extends CardWithImage<IProduct> {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}
	}
}