import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected submitButton: HTMLButtonElement;
	protected errorsContainer: HTMLElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
		this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

		container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.events.emit(`${container.name}.${String(field)}:change`, { field, value });
		})

		container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${container.name}:submit`);
		})
	}

	set valid(value: boolean) {
		if (this.submitButton) {
			this.submitButton.disabled = !value;
		}
	}

	set errors(value: string[]) {
		if (this.errorsContainer) {
			this.errorsContainer.textContent = value.join('. ');
		}
	}

	render(state: Partial<IFormState> & T): HTMLElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

interface IOrderForm {
	payment: string;
	address: string;
}

export class FormOrder extends Form<IOrderForm> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>('button[name=card]', container);
		this.cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', container);

		this.cardButton.addEventListener('click', () => {
			this.payment = 'card';
			this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
		})

		this.cashButton.addEventListener('click', () => {
			this.payment = 'cash';
			this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
		})
	}

	set payment(value: string) {
		if (value === 'card') {
			this.cardButton.classList.add('button_alt-active');
			this.cashButton.classList.remove('button_alt-active');
		} else if (value === 'cash') {
			this.cashButton.classList.add('button_alt-active');
			this.cardButton.classList.remove('button_alt-active');
		} else {
			this.cardButton.classList.remove('button_alt-active');
			this.cashButton.classList.remove('button_alt-active');
		}
	}

	set address(value: string) {
		const input = this.container.querySelector('input[name=address]') as HTMLInputElement;
		if (input) {
			input.value = value;
		}
	}
}

interface IContactsForm {
	email: string;
	phone: string;
}

export class FormContacts extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		const input = this.container.querySelector('input[name=email]') as HTMLInputElement;
		if (input) {
			input.value = value;
		}
	}

	set phone(value: string) {
		const input = this.container.querySelector('input[name=phone]') as HTMLInputElement;
		if (input) {
			input.value = value;
		}
	}
}