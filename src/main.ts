import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { ApiWebLarek } from './components/ApiWebLarek';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { CardCatalog, CardPreview, CardBasket } from './components/view/Card';
import { FormOrder, FormContacts } from './components/view/Form';

const events = new EventEmitter();

const ApiLarek = new ApiWebLarek(new Api(API_URL));

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const pageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(pageContainer, events);
const modal = new Modal(modalContainer, events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
	const products = catalogModel.getItems();

	const cardsArray = products.map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		})
		return card.render(item);
	})
	
	page.catalog = cardsArray;
})

events.on<{ id: string }>('card:select', (item) => {
	catalogModel.setPreview(item as IProduct);
})

events.on<IProduct>('preview:changed', (item) => {
	if (item) {
		const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (basketModel.isInBasket(item.id)) {
					basketModel.removeBasketItem(item.id);
				} else {
					basketModel.addBasketItem(item);
				}
				modal.close();
			}
		})

		cardPreview.setButtonState(
			basketModel.isInBasket(item.id),
			item.price === null,
		)
		modal.render({
			content: cardPreview.render(item),
		})
	}
})

events.on('basket:changed', () => {
	page.counter = basketModel.getBasketCount();

	if (modalContainer.classList.contains('modal_active') && modalContainer.querySelector('.basket')) {
		renderBasketInModal();
	}
})

events.on('basket:open', () => {
	renderBasketInModal();
})

function renderBasketInModal() {
	const items = basketModel.getBasketItems();

	const basketCards = items.map((item, index) => {
		const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => basketModel.removeBasketItem(item.id),
		})
		cardBasket.index = index + 1;
		return cardBasket.render(item);
	})

	modal.render({
		content: basketView.render({
			items: basketCards,
			total: basketModel.getTotalPrice(),
		})
	})
}

events.on('order:open', () => {
	buyerModel.clearBuyerData();

	const errors = buyerModel.validateBuyerData();
	const step1Errors = [errors.payment, errors.address].filter(Boolean) as string[];

	modal.render({
		content: orderForm.render({
			payment: '',
			address: '',
			valid: step1Errors.length === 0,
			errors: step1Errors,
		})
	})
})

events.on<{ field: keyof IBuyer; value: string }>('order.payment:change', handleOrderFormUpdate);
events.on<{ field: keyof IBuyer; value: string }>('order.address:change', handleOrderFormUpdate);
events.on<{ field: keyof IBuyer; value: string }>('contacts.email:change', handleOrderFormUpdate);
events.on<{ field: keyof IBuyer; value: string }>('contacts.phone:change', handleOrderFormUpdate);

function handleOrderFormUpdate(data: { field: keyof IBuyer; value: string }) {
	buyerModel.setBuyerField(data.field, data.value);
}

events.on('order:submit', () => {
	const errors = buyerModel.validateBuyerData();
	const step2Errors = [errors.email, errors.phone].filter(Boolean) as string[];

	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: step2Errors.length === 0,
			errors: step2Errors,
		})
	})
})

events.on('buyer:changed', () => {
	const errors = buyerModel.validateBuyerData();

	const activeForm = modalContainer.querySelector('form');
	if (activeForm) {
		if (activeForm.name === 'order') {
			const step1Errors = [errors.payment, errors.address].filter(Boolean) as string[];
			orderForm.valid = step1Errors.length === 0;
			orderForm.errors = step1Errors;
		} else if (activeForm.name === 'contacts') {
			const step2Errors = [errors.email, errors.phone].filter(Boolean) as string[];
			contactsForm.valid = step2Errors.length === 0;
			contactsForm.errors = step2Errors;
		}
	}
})

events.on('contacts:submit', () => {
	const buyerData = buyerModel.getBuyerData();
	const basketItems = basketModel.getBasketItems();

	const orderPayload = {
		...buyerData,
		total: basketModel.getTotalPrice(),
		items: basketItems.map(item => item.id),
	}

	ApiLarek.createOrder(orderPayload).then((result) => {
		const successView = new Success(cloneTemplate(successTemplate), events);
		modal.render({
			content: successView.render({
				total: result.total || orderPayload.total,
			})
		})

		basketModel.clearBasket();
		buyerModel.clearBuyerData();
	})
	.catch((error) => {
		console.error('Критическая ошибка при оформлении заказа:', error);
	})
})

events.on('order:clear', () => {
	modal.close();
})

events.on('modal:open', () => {
	page.locked = true;
})

events.on('modal:close', () => {
	page.locked = false;
})

ApiLarek.getProductList().then((response) => {
	catalogModel.setItems(response.items);
}).catch((error) => {
	console.error('Ошибка при инициализации каталога товаров:', error);
})