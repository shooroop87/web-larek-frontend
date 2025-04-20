// ==================== Импорт стилей и утилит ====================
import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/Services/WebLarekApi';
import { ProductCollectionModel } from './components/Model/ProductCollectionModel';
import { ensureElement } from './utils/utils';
import { ShoppingCartModel } from './components/Model/ShoppingCartModel';
import { CheckoutModel } from './components/Model/CheckoutModel';
import { ModalView } from './components/View/ModalView';
import { ShoppingCartView } from './components/View/ShoppingCartView';
import { CheckoutPaymentView } from './components/View/CheckoutPaymentView';
import { CheckoutContactsView } from './components/View/CheckoutContactsView';
import { OrderSuccessView } from './components/View/OrderSuccessView';
import { CatalogView } from './components/View/CatalogView';

// ==================== Импорт презентеров ====================
import { CatalogPresenter } from './components/Presenters/CatalogPresenter';
import { ShoppingCartPresenter } from './components/Presenters/ShoppingCartPresenter';
import { CheckoutPresenter } from './components/Presenters/CheckoutPresenter';

// ==================== Данные из шаблонов DOM ====================
const productCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const productDetailsTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const checkoutPaymentTemplate = document.querySelector('#order') as HTMLTemplateElement;
const checkoutContactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// ==================== Элементы интерфейса ====================
const headerCartButton = ensureElement<HTMLButtonElement>('.header__basket');
const headerCartCounter = ensureElement<HTMLElement>('.header__basket-counter');

// ==================== Инициализация базовых компонентов ====================
const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);

// ==================== Инициализация моделей ====================
const catalogModel = new ProductCollectionModel(events);
const cartModel = new ShoppingCartModel(events);
const checkoutModel = new CheckoutModel(events);

// ==================== Инициализация представлений ====================
const cartView = new ShoppingCartView(cartTemplate, events, headerCartButton, headerCartCounter);
const paymentView = new CheckoutPaymentView(checkoutPaymentTemplate, events, modal);
const contactsView = new CheckoutContactsView(checkoutContactsTemplate, events, modal);
const successView = new OrderSuccessView(successTemplate);
const catalogView = new CatalogView(
  ensureElement<HTMLElement>('.gallery'),
  events,
  productCardTemplate,
  catalogModel
);

// ==================== Инициализация презентеров ====================
const catalogPresenter = new CatalogPresenter(
  events,
  catalogModel,
  api,
  productDetailsTemplate
);

const cartPresenter = new ShoppingCartPresenter(
  events,
  cartModel,
  catalogModel,
  cartView,
  cartItemTemplate,
  modal
);

const checkoutPresenter = new CheckoutPresenter(
  events,
  checkoutModel,
  cartModel,
  api,
  paymentView,
  contactsView,
  successTemplate,
  modal,
  cartView
);

// ==================== Обработчики модальных окон ====================
events.on('modal:open', () => {
  modal.locked = true;
});

events.on('modal:close', () => {
  modal.locked = false;
});

document.querySelectorAll('.modal__close').forEach((btn) => {
  btn.addEventListener('click', () => {
    modal.close();
  });
});

events.on("checkout:success:show", (data: { total: number }) => {
  const content = successView.render({ total: data.total });
  modal.content = content;
  modal.render();

  successView.setCloseHandler(() => {
    modal.close();
    events.emit("order:success:close");
  });
});
