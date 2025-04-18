import { AppApi } from './components/api/AppApi';
import { EventEmitter } from './components/base/events';
import { CartModel } from './components/model/CartModel';
import { OrderModel } from './components/model/OrderModel';
import { ProductListModel } from './components/model/ProductListModel';
import { CartView } from './components/view/CartView';
import { FormContacts } from './components/view/FormContacts';
import { FormOrder } from './components/view/FormOrder';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import {
	ProductViewList,
	ProductViewCart,
	ProductViewPreview,
} from './components/view/ProductView';
import { SuccessView } from './components/view/SuccessView';
import './scss/styles.scss';
import { Events, IProduct, OrderData } from './types';
import { OrderModelTypes } from './types/model/OrderModel';
import { PaymentMethods } from './types/view/FormOrder';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL);

const productCardCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productCardPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productCardCartTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');

// Model
const productListModel = new ProductListModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

// View
const page = new Page(ensureElement(document.body), events);
const modal = new Modal(ensureElement('#modal-container'), events);
const cart = new CartView(cloneTemplate(cartTemplate), events);
const formOrder = new FormOrder(cloneTemplate('#order'), events);
const formContacts = new FormContacts(cloneTemplate('#contacts'), events);
const success = new SuccessView(cloneTemplate('#success'), events);

// Get products on startup and update model
api
	.getProducts()
	.then((res) => {
		productListModel.setProducts(res.items);
	})
	.catch((err) => console.error(err));

// Update list of products view
events.on(Events.ProductListSet, (items: IProduct[]) => {
	const cards: HTMLElement[] = items.map((item) => {
		const container = cloneTemplate(productCardCatalogTemplate);

		const { title, price, category, image, id } = item;
		const data = { title, price, category, image, id };

		const clickHandler = () => events.emit(Events.ProductClick, item);
		const card = new ProductViewList(container, events, clickHandler);

		return card.render(data);
	});

	page.products = cards;
});

// Close modal
events.on(Events.ModalClose, () => {
	modal.close();
});

// Open product modal
events.on(Events.ProductClick, (item: IProduct) => {
	const inCart = cartModel.getProducts().has(item.id);
	const buttonHandler = () => {
		if (!inCart) {
			events.emit(Events.ProductAdd, item);
		} else {
			events.emit(Events.ProductDelete, item);
		}
		events.emit(Events.ModalClose);
	};

	const card = new ProductViewPreview(
		cloneTemplate(productCardPreviewTemplate),
		events,
		buttonHandler
	);

	if (!item.price) card.buttonDisable = true;

	inCart
		? (card.buttonText = 'Удалить из корзины')
		: (card.buttonText = 'В корзину');
	modal.render({ content: card.render(item) });
});

// Open a cart
events.on(Events.CartOpen, () => {
	modal.render({ content: cart.render() });
});

// Render changes to the cart (add, remove)
events.on(Events.CartChanged, () => {
	const products = Array.from(cartModel.getProducts().values()).map(
		(item, index) => {
			const { title, price, id } = item;
			const data = { title, price, id, index: index + 1 };
			const card = new ProductViewCart(
				cloneTemplate(productCardCartTemplate),
				events,
				() => events.emit(Events.ProductDelete, item)
			);
			return card.render(data);
		}
	);
	cart.products = products;
	const amountOfProducts = cartModel.getAmountOfProducts();
	amountOfProducts > 0 ? (cart.valid = true) : (cart.valid = false);
	page.cartCount = amountOfProducts;
	cart.totalPrice = cartModel.getTotalPrice();
});

// Add product to the cart model
events.on(Events.ProductAdd, (data: IProduct) => {
	cartModel.addProduct(data);
});

// Remove product from the cart model
events.on(Events.ProductDelete, (item: IProduct) => {
	cartModel.removeProduct(item.id);
});

// Open delivery and payment form
events.on(Events.FormOrder, () => {
	orderModel.clear();
	const orderData = { paymentType: orderModel.payment, deliveryAddressValue: orderModel.address};
	modal.render({ content: formOrder.render({ ...orderData, valid: false, errors: []} ) });
});

// Open contacts form
events.on(Events.FormContacts, () => {
	const contactsData = { emailValue: orderModel.email, phoneValue: orderModel.phone };
	modal.render({ content: formContacts.render({ ...contactsData, valid: false, errors: [] }) });
});

// Form input field changed
events.on(
	/^order\.[\w-]+:change$/,
	(data: { field: keyof OrderModelTypes; value: string }) => {
		orderModel.setFieldOrder(data.field, data.value);
	}
);

events.on(
	/^contacts\.[\w-]+:change$/,
	(data: { field: keyof OrderModelTypes; value: string }) => {
		orderModel.setFieldContacts(data.field, data.value);
	}
);

// Form valid
events.on(Events.OrderValid, () => {
	formOrder.valid = true;
});

events.on(Events.ContactsValid, () => {
	formContacts.valid = true;
});

// Form invalid
events.on(Events.OrderError, (data) => {
	formOrder.valid = false;
	let errors = '';
	Object.values(data).forEach((error) => (errors += error));
	formOrder.errors = errors;
});

events.on(Events.ContactsError, (data) => {
	formContacts.valid = false;
	let errors = '';
	Object.values(data).forEach((error) => (errors += ` ${error}`));
	formContacts.errors = errors;
});

// Payment method changed in form
events.on(Events.OrderFormPaymentMethod, (data: { type: PaymentMethods }) => {
	orderModel.payment = data.type;
});

// Payment method changed in model
events.on(Events.OrderModelPaymentMethod, (data: { type: PaymentMethods}) => {
	formOrder.paymentType = data.type;
})

// Submit order
events.on(Events.OrderSubmit, () => {
	const orderData: OrderData = {
		payment: orderModel.payment,
		address: orderModel.address,
		email: orderModel.email,
		phone: orderModel.phone,
		items: Array.from(cartModel.getProducts().keys()),
		total: cartModel.getTotalPrice(),
	};

	api
		.order(orderData)
		.then((res) => {
			if (res.total) {
				modal.render({ content: success.render({ price: res.total }) });
			}
			cartModel.clearCart();
		})
		.catch((err) => console.error(err));
});