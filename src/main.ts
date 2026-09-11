import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { ApiWebLarek } from './components/ApiWebLarek';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer, IOrder, TBuyerErrors } from './types';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';

const events = new EventEmitter();
const ApiLarek = new ApiWebLarek(new Api(API_URL));

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer);

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(contactsTemplate), events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
	onClick: () => events.emit('preview:buy-click'),
});
const successView = new Success(cloneTemplate(successTemplate), events);

const makeImageUrl = (path: string): string =>
	path.startsWith('http') ? path : `${CDN_URL}${path}`;

const getStep1Errors = (e: TBuyerErrors): string[] =>
	[e.payment, e.address].filter(Boolean) as string[];

const getStep2Errors = (e: TBuyerErrors): string[] =>
	[e.email, e.phone].filter(Boolean) as string[];

function syncBasketView(): void {
	const items = basketModel.getBasketItems();
	const cards = items.map((item, index) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove-item', { id: item.id }),
		});
		return card.render({ ...item, index: index + 1, image: makeImageUrl(item.image) });
	});

	basketView.render({
		items: cards,
		total: basketModel.getTotalPrice(),
		disabled: items.length === 0,
	});
}

function syncOrderForm(): void {
	const buyerData = buyerModel.getBuyerData();
	const errors = buyerModel.validateBuyerData();
	const step1Errors = getStep1Errors(errors);

	orderForm.render({
		payment: buyerData.payment,
		address: buyerData.address,
		valid: step1Errors.length === 0,
		errors: step1Errors,
	});
}

function syncContactsForm(): void {
	const buyerData = buyerModel.getBuyerData();
	const errors = buyerModel.validateBuyerData();
	const step2Errors = getStep2Errors(errors);

	contactsForm.render({
		email: buyerData.email,
		phone: buyerData.phone,
		valid: step2Errors.length === 0,
		errors: step2Errors,
	});
}

events.on('items:changed', () => {
	const products = catalogModel.getItems();

	const cards = products.map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		})
		return card.render({ ...item, image: makeImageUrl(item.image) });
	})
	
	gallery.render({ catalog: cards });
})

events.on<IProduct>('card:select', (item) => {
	catalogModel.setPreview(item);
})

events.on('preview:changed', () => {
	const item = catalogModel.getPreview();
	if (!item) {
		return;
	}

	const buttonText = item.price === null
		? 'Недоступно'
		: basketModel.isInBasket(item.id)
			? 'Удалить из корзины'
			: 'Купить';
	
	modal.render({
		content: cardPreview.render({
			...item,
			image: makeImageUrl(item.image),
			buttonText,
			buttonDisabled: item.price === null,
		})
	});
	modal.open();
})

events.on('preview:buy-click', () => {
	const item = catalogModel.getPreview();
	if (!item) {
		return;
	}
	if (basketModel.isInBasket(item.id)) {
		basketModel.removeBasketItem(item.id);
	} else {
		basketModel.addBasketItem(item);
	}

	modal.close();
})

events.on('basket:changed', () => {
	header.render({ counter: basketModel.getBasketCount() });
	syncBasketView();
})

events.on('basket:open', () => {
	modal.render({ content: basketView.render() });
	modal.open();
})

events.on<{ id: string }>('basket:remove-item', ({ id }) => {
	basketModel.removeBasketItem(id);
})

events.on('order:open', () => {
	modal.render({ content: orderForm.render() });
	modal.open();
})

const onBuyerFieldChange = (data: { field: keyof IBuyer; value: string }): void => {
	buyerModel.setBuyerField(data.field, data.value);
};

events.on('order.payment:change', onBuyerFieldChange);
events.on('order.address:change', onBuyerFieldChange);
events.on('contacts.email:change', onBuyerFieldChange);
events.on('contacts.phone:change', onBuyerFieldChange);

events.on('buyer:changed', () => {
	syncOrderForm();
	syncContactsForm();
})

events.on('order:submit', () => {
	modal.render({ content: contactsForm.render() });
	modal.open();
})

events.on('contacts:submit', () => {
	const buyerData = buyerModel.getBuyerData();
	const basketItems = basketModel.getBasketItems();

	const orderPayload: IOrder = {
		...buyerData,
		total: basketModel.getTotalPrice(),
		items: basketItems.map((item) => item.id),
	}

	ApiLarek.createOrder(orderPayload).then((result) => {
		modal.render({ content: successView.render({ total: result.total }) });
		modal.open();

		basketModel.clearBasket();
		buyerModel.clearBuyerData();
	})
	.catch((error) => {
		console.error('Критическая ошибка при оформлении заказа:', error);
		contactsForm.render({
			email: buyerData.email,
			phone: buyerData.phone,
			valid: false,
			errors: ['Не удалось оформить заказ. Попробуйте еще раз.'],
		});
	});
})

events.on('success:close', () => {
	modal.close();
})

syncBasketView();
syncOrderForm();
syncContactsForm();

ApiLarek.getProductList().then((response) => {
	catalogModel.setItems(response.items);
}).catch((error) => {
	console.error('Ошибка при инициализации каталога товаров:', error);
})