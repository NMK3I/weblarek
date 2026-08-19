import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { ApiWebLarek } from './components/ApiWebLarek';
import { API_URL } from './utils/constants';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();
const ApiLarek = new ApiWebLarek(API_URL);

console.log('=== Проверка работы методов ===');

catalogModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', catalogModel.getItems());

const testItem = apiProducts.items[0];
if (testItem) {
	console.log('Поиск товара по ID: ', catalogModel.getItemById(testItem.id));
	catalogModel.setPreview(testItem);
	console.log('Товар в превью: ', catalogModel.getPreview());
}

if (testItem) {
	basketModel.addBasketItem(testItem);
	console.log('Товары в корзине (getBasketItems): ', basketModel.getBasketItems());
	console.log('Количество товаров в корзине: ', basketModel.getBasketCount());
	console.log('Общая стоимость корзины: ', basketModel.getTotalPrice());
	console.log('Товар находится в корзине? (isInBasket): ', basketModel.isInBasket(testItem.id));

	basketModel.removeBasketItem(testItem.id);
	console.log('Количество после удаления: ', basketModel.getBasketCount());
	basketModel.clearBasket();
}

console.log('Ошибки пустых полей покупателя: ', buyerModel.validateBuyerData());

buyerModel.setBuyerField('payment', 'card');
buyerModel.setBuyerField('email', 'example@ya.ru');
buyerModel.setBuyerField('phone', '+79991112233');
buyerModel.setBuyerField('address', 'ул. Полежаева, д. 67');

console.log('Все данные покупателя (getBuyerData): ', buyerModel.getBuyerData());
console.log('Ошибки после полного заполнения полей: ', buyerModel.validateBuyerData());

console.log('=== Конец теста ===');

console.log('=== Проверка сетевого запроса ===');

ApiLarek.getProductList()
	.then((serverResponse) => { console.log('Данные с сервера успешно получены: ', serverResponse);
		catalogModel.setItems(serverResponse.items);
		console.log('Массив товаров, успешно сохранен в CatalogModel: ', catalogModel.getItems());
	})
	.catch((error) => {
		console.log('Ошибка при выполнении запроса: ', error);
	})