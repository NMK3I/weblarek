import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<IFormState & T> {
	protected submitButton: HTMLButtonElement;
	protected errorsContainer: HTMLElement;

	constructor(container: HTMLFormElement, protected readonly events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
		this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

		container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			this.events.emit(`${container.name}.${String(field)}:change`, { field, value: target.value });
		});

		container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string[]) {
		this.errorsContainer.textContent = value.join('. ');
	}
}