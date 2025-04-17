import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { LarekAPI } from './components/LarekAPI';
import { 
  BasketModal, 
  OrderAddressModal, 
  OrderContactsModal, 
  ProductModal, 
  SuccessModal 
} from './components/Modal';

// Импорт презентеров
import { ProductPresenter } from './components/ProductPresenter';
import { CartPresenter } from './components/CartPresenter';
import { OrderPresenter } from './components/OrderPresenter';

// Импорт типов
import { IProduct } from './types';

// Используем переменную из .env
const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek';
const CDN_URL = 'https://larek-api.nomoreparties.co'; // для картинок, если нужно

// Создание основных компонентов
const eventEmitter = new EventEmitter();
const api = new LarekAPI(API_URL, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }, CDN_URL);
  
const appState = new AppState();

// Получение DOM-элементов
const basketButtonEl = document.querySelector('.header__basket') as HTMLElement;
const basketCounterEl = document.querySelector('.header__basket-counter') as HTMLElement;
const modalContainerEl = document.querySelector('#modal-container') as HTMLElement;
const galleryEl = document.querySelector('.gallery') as HTMLElement;

// Получение шаблонов
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// Создание модальных окон
const productModal = new ProductModal(modalContainerEl, eventEmitter);
const basketModal = new BasketModal(modalContainerEl, cardBasketTemplate, eventEmitter);
const orderAddressModal = new OrderAddressModal(modalContainerEl, orderTemplate, eventEmitter);
const orderContactsModal = new OrderContactsModal(modalContainerEl, contactsTemplate, eventEmitter);
const successModal = new SuccessModal(modalContainerEl, successTemplate, eventEmitter);

// Создание презентеров
const productPresenter = new ProductPresenter(appState, productModal, eventEmitter);
const cartPresenter = new CartPresenter(appState, basketModal, eventEmitter);
const orderPresenter = new OrderPresenter(
  appState, 
  orderAddressModal, 
  orderContactsModal, 
  successModal, 
  api, 
  eventEmitter
);

// Загрузка каталога и первичная инициализация
async function initApp() {
  try {
    const products = await api.getProducts();
    appState.setCatalog(products);
    renderCatalog(products);
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
  }
}

// Рендеринг каталога товаров
function renderCatalog(products: IProduct[]) {
  galleryEl.innerHTML = '';
  
  products.forEach(product => {
    const cardElement = cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
    const cardContainer = cardElement.querySelector('.card') as HTMLElement;
    
    cardContainer.dataset.id = product.id;
    cardContainer.addEventListener('click', () => {
      eventEmitter.emit('card:select', product);
    });
    
    // Заполнение данных карточки
    const titleEl = cardContainer.querySelector('.card__title');
    const priceEl = cardContainer.querySelector('.card__price');
    const categoryEl = cardContainer.querySelector('.card__category');
    const imageEl = cardContainer.querySelector('.card__image') as HTMLImageElement;
    
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) priceEl.textContent = `${product.price ?? 'Бесценно'} синапсов`;
    if (categoryEl) {
      categoryEl.textContent = product.category;
      categoryEl.className = 'card__category';
      const categoryClass = product.category
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]/g, '');
      if (categoryClass) {
        categoryEl.classList.add(`card__category_${categoryClass}`);
      }
    }
    if (imageEl) {
      imageEl.src = product.image;
      imageEl.alt = product.title;
    }
    
    galleryEl.append(cardContainer);
  });
}

// Обработчик клика по корзине
basketButtonEl.addEventListener('click', () => {
  eventEmitter.emit('basket:open');
});

// Слушатель события изменения корзины
eventEmitter.on('basket:changed', (data: { count: number, total: number }) => {
  basketCounterEl.textContent = data.count.toString();
  basketCounterEl.classList.toggle('header__basket-counter_hidden', data.count === 0);
});

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);