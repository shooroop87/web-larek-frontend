import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { Card } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { BasketModal, OrderAddressModal, OrderContactsModal, ProductModal, SuccessModal } from './components/Modal';

// Создаем экземпляр брокера событий
const eventEmitter = new EventEmitter();

// Создаем API для работы с сервером
const API_URL = 'https://api-web-larek.glitch.me/api';
const CDN_URL = 'https://api-web-larek.glitch.me';
const api = new LarekAPI(CDN_URL, API_URL);

// Создаем модель данных приложения
const appState = new AppState();

// Получаем шаблоны компонентов
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// Получаем элементы страницы
const galleryEl = document.querySelector('.gallery') as HTMLElement;
const basketButtonEl = document.querySelector('.header__basket') as HTMLElement;
const basketCounterEl = document.querySelector('.header__basket-counter') as HTMLElement;
const modalContainerEl = document.querySelector('#modal-container') as HTMLElement;

// Создаем модальные окна
const productModal = new ProductModal(modalContainerEl, eventEmitter);
const basketModal = new BasketModal(modalContainerEl, cardBasketTemplate, eventEmitter);
const orderAddressModal = new OrderAddressModal(modalContainerEl, orderTemplate, eventEmitter);
const orderContactsModal = new OrderContactsModal(modalContainerEl, contactsTemplate, eventEmitter);
const successModal = new SuccessModal(modalContainerEl, successTemplate, eventEmitter);

/**
 * Загрузка данных с сервера
 */
async function initApp() {
  try {
    const products = await api.getProducts();
    console.log('Loaded products:', products);
    appState.setCatalog(products);
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
  }
}

/**
 * Отрисовка каталога товаров
 */
function renderProducts(products) {
  galleryEl.innerHTML = '';
  
  products.forEach(product => {
    const cardElement = cardCatalogTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;
    const card = new Card(cardElement, eventEmitter);
    
    // Установка данных
    cardElement.dataset.id = product.id;
    
    card.render(product);
    galleryEl.append(cardElement);
  });
}

/**
 * Обновление счетчика товаров в корзине
 */
function updateBasketCounter(count) {
  basketCounterEl.textContent = count.toString();
  
  if (count === 0) {
    basketCounterEl.classList.add('header__basket-counter_hidden');
  } else {
    basketCounterEl.classList.remove('header__basket-counter_hidden');
  }
}

// Обработчики событий

// Клик на кнопке корзины
basketButtonEl.addEventListener('click', () => {
  basketModal.render(appState.basket);
  basketModal.setTotal(appState.getTotalPrice());
  basketModal.open();
});

// События модели данных

// Загрузка каталога
eventEmitter.on('catalog:loaded', (products) => {
  console.log('Rendering catalog:', products);
  renderProducts(products);
});

// Выбор товара
eventEmitter.on('card:select', (product) => {
  console.log('Selected product:', product);
  appState.setPreview(product);
  productModal.render(product);
  productModal.setInBasket(product.inBasket || false);
  productModal.open();
});

// Добавление товара в корзину
eventEmitter.on('card:add', (id) => {
  console.log('Adding to basket, id:', id);
  const product = appState.getProductById(id);
  if (product) {
    appState.addToBasket(product);
    
    // Обновляем отображение кнопки в модальном окне, если оно открыто
    if (appState.preview && appState.preview.id === id) {
      productModal.setInBasket(true);
    }
  }
});

// Удаление товара из корзины
eventEmitter.on('card:remove', (id) => {
  console.log('Removing from basket, id:', id);
  appState.removeFromBasket(id);
  
  // Обновляем отображение кнопки в модальном окне, если оно открыто
  if (appState.preview && appState.preview.id === id) {
    productModal.setInBasket(false);
  }
});

// Изменение корзины
eventEmitter.on('basket:changed', (data) => {
  console.log('Basket changed:', data);
  updateBasketCounter(data.count);
  
  // Обновляем модальное окно корзины, если оно открыто
  if (basketModal.isOpen()) {
    basketModal.setItems(appState.basket);
    basketModal.setTotal(data.total);
  }
});

// События заказа

// Открытие формы заказа
eventEmitter.on('order:open', () => {
  console.log('Opening order form');
  basketModal.close();
  orderAddressModal.render();
  orderAddressModal.open();
});

// Отправка адреса и способа оплаты
eventEmitter.on('order:address', (data) => {
  console.log('Order address data:', data);
  appState.updateOrder(data);
  orderAddressModal.close();
  orderContactsModal.render();
  orderContactsModal.open();
});

// Отправка контактных данных
eventEmitter.on('order:contacts', async (data) => {
  console.log('Order contacts data:', data);
  appState.updateOrder(data);
  
  try {
    // Отправляем заказ на сервер
    const orderData = {
      ...appState.order,
      items: appState.basket.map(item => item.id)
    };
    console.log('Sending order:', orderData);
    
    const result = await api.createOrder(orderData);
    console.log('Order created:', result);
    
    orderContactsModal.close();
    successModal.render({
      orderId: result.id,
      total: result.total
    });
    successModal.open();
    
    // Очищаем корзину
    appState.clearBasket();
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
  }
});

// Закрытие модального окна успеха
eventEmitter.on('success:close', () => {
  console.log('Closing success modal');
  successModal.close();
});

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  console.log('App initialization');
  initApp();
});