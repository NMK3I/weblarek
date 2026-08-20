import { IBuyer, TPayment, TBuyerErrors } from "../../types";

export class BuyerModel {
	private payment: TPayment | null;
	private email: string;
	private phone: string;
	private address: string;

	constructor() {
		this.payment = null;
		this.email = '';
		this.phone = '';
		this.address = '';
	}

	setBuyerField(field: keyof IBuyer, value: string): void {
		switch (field) {
			case 'payment':
				this.payment = value as TPayment;
				break;
			
			case 'email':
				this.email = value;
				break;

			case 'phone':
				this.phone = value;
				break;

			case 'address':
				this.address = value;
				break;
		}
	}

	getBuyerData(): IBuyer {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address
		}
	}

	clearBuyerData(): void {
		this.payment = null;
		this.email = '';
		this.phone = '';
		this.address = '';
	}

	validateBuyerData(): TBuyerErrors {
		const currentErrors: TBuyerErrors = {};

		if (!this.payment) {
			currentErrors.payment = 'Не выбран способ оплаты';
		}
		
		if (this.email.trim().length === 0) {
			currentErrors.email = 'Укажите email';
		}

		if (this.phone.trim().length === 0) {
			currentErrors.phone = 'Укажите номер телефона';
		}

		if (this.address.trim().length === 0) {
			currentErrors.address = 'Укажите адрес доставки';
		}

		return currentErrors;
	}
}