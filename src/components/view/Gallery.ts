import { Component } from "../base/Component";
import { IGalleryData } from "../../types";

export class Gallery extends Component<IGalleryData> {
	constructor(container: HTMLElement) {
		super(container);
	}
	
	set catalog(cards: HTMLElement[]) {
		this.container.replaceChildren(...cards);
	}
}