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
import { IProduct } from './types';

// Импорт презентеров
import { CatalogPresenter } from './components/Presenters/CatalogPresenter';
import { ShoppingCartPresenter } from './components/Presenters/ShoppingCartPresenter';
import { CheckoutPresenter } from './components/Presenters/CheckoutPresenter';

// Шаблоны
const productCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const productDetailsTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const checkoutPaymentTemplate = document.querySelector('#order') as HTMLTemplateElement;
const checkoutContactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Инициализация базовых компонентов
const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);

// Инициализация моделей
const catalogModel = new ProductCollectionModel(events);
const cartModel = new ShoppingCartModel();
const checkoutModel = new CheckoutModel(events);

// Инициализация представлений
const cartView = new ShoppingCartView(cartTemplate, events);
const paymentView = new CheckoutPaymentView(checkoutPaymentTemplate, events);
const contactsView = new CheckoutContactsView(checkoutContactsTemplate, events);
const successView = new OrderSuccessView(successTemplate, events);

// Инициализация презентеров
const catalogPresenter = new CatalogPresenter(
  events, 
  catalogModel, 
  api, 
  productCardTemplate, 
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
  modal
);

// Общие обработчики для модальных окон
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

// Обработка стартовой карточки
setTimeout(() => {
  const startupModal = document.querySelector('.modal_active');
  if (startupModal) {
    // Получаем данные из DOM
    const cardTitle = startupModal.querySelector('.card__title')?.textContent || '';
    const cardPrice = parseInt((startupModal.querySelector('.card__price')?.textContent || '0').replace(/\D/g, ''));
    const cardCategory = startupModal.querySelector('.card__category')?.textContent || '';
    const cardText = startupModal.querySelector('.card__text')?.textContent || '';
    
    // Создаем объект карточки
    const startupCardData: IProduct = {
      id: 'startup-card-' + Date.now(),
      title: cardTitle,
      price: cardPrice,
      category: cardCategory,
      description: cardText,
      image: ''
    };
    
    // Устанавливаем карточку как выбранную в модели
    catalogModel.selectedProduct = startupCardData;
    
    // Удаляем существующие обработчики с кнопки закрытия
    const closeButton = startupModal.querySelector('.modal__close');
    if (closeButton) {
      const newCloseButton = closeButton.cloneNode(true);
      closeButton.parentNode?.replaceChild(newCloseButton, closeButton);
      
      // Добавляем новый обработчик закрытия
      newCloseButton.addEventListener('click', () => {
        startupModal.classList.remove('modal_active');
      });
    }
    
    // Удаляем существующие обработчики с кнопки "В корзину"
    const addButton = startupModal.querySelector('.button');
    if (addButton) {
      const newAddButton = addButton.cloneNode(true);
      addButton.parentNode?.replaceChild(newAddButton, addButton);
      
      // Добавляем новый прямой обработчик
      newAddButton.addEventListener('click', () => {
        // Здесь используем презентер для добавления товара
        cartModel.addProduct(startupCardData);
        cartView.renderHeaderCartCounter(cartModel.getItemCount());
        startupModal.classList.remove('modal_active');
      });
    }
  }
}, 100);