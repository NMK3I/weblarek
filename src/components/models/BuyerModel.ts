import { IBuyer, TPayment } from "../../types";

export class BuyerModel {
	private _payment: TPayment | null;
	private _email: string;
	private _phone: string;
	private _address: string;
	private _errors: Partial<Record<keyof IBuyer, string>>;

	constructor() {
		this._payment = null;
		this._email = '';
		this._phone = '';
		this._address = '';
		this._errors = {};
	}

	setBuyerField(field: keyof IBuyer, value: string): void {
		switch (field) {
			case 'payment':
				this._payment = value as TPayment;
				break;
			
			case 'email':
				this._email = value;
				break;

			case 'phone':
				this._phone = value;
				break;

			case 'address':
				this._address = value;
				break;
		}

		this.validateBuyerData();
	}

	getBuyerData(): IBuyer {
		return {
			payment: this._payment,
			email: this._email,
			phone: this._phone,
			address: this._address
		}
	}

	clearBuyerData(): void {
		this._payment = null;
		this._email = '';
		this._phone = '';
		this._address = '';
		this._errors = {};
	}

	validateBuyerData(): Partial<Record<keyof IBuyer, string>> {
		const currentErrors: Partial<Record<keyof  IBuyer, string>> = {};

		if (!this._payment) {
			currentErrors.payment = 'Не выбран способ оплаты';
		}
		
		if (this._email.trim().length === 0) {
			currentErrors.email = 'Укажите email';
		}

		if (this._phone.trim().length === 0) {
			currentErrors.phone = 'Укажите номер телефона';
		}

		if (this._address.trim().length === 0) {
			currentErrors.address = 'Укажите адрес доставки';
		}

		this._errors = currentErrors;
		return this._errors;
	}
}