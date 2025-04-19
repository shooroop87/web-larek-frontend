import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/Services/WebLarekApi';
import { ProductCollectionModel } from './components/Model/ProductCollectionModel';
import { ProductItemView } from './components/View/ProductItemView';
import { ProductDetailsView } from './components/View/ProductDetailsView';
import { ICheckoutForm, IProduct } from './types';
import { ModalView } from './components/View/ModalView';
import { ensureElement } from './utils/utils';
import { ShoppingCartModel } from './components/Model/ShoppingCartModel';
import { ShoppingCartView } from './components/View/ShoppingCartView';
import { CartItemView } from './components/View/CartItemView';
import { CheckoutModel } from './components/Model/CheckoutModel';
import { CheckoutPaymentView } from './components/View/CheckoutPaymentView';
import { CheckoutContactsView } from './components/View/CheckoutContactsView';
import { OrderSuccessView } from './components/View/OrderSuccessView';

const productCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const productDetailsTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const checkoutPaymentTemplate = document.querySelector('#order') as HTMLTemplateElement;
const checkoutContactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const catalog = new ProductCollectionModel(events);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new ShoppingCartView(cartTemplate, events);
const cartModel = new ShoppingCartModel();
const checkout = new CheckoutModel(events);
const paymentForm = new CheckoutPaymentView(checkoutPaymentTemplate, events);
const contactsForm = new CheckoutContactsView(checkoutContactsTemplate, events);

/********** Отображения карточек товара на странице **********/
events.on('productCards:receive', () => {
  catalog.products.forEach(item => {
    const productCard = new ProductItemView(productCardTemplate, events, { onClick: () => events.emit('catalog:product:select', item) });
    ensureElement<HTMLElement>('.gallery').append(productCard.render(item));
  });
});

/********** Получить объект данных "IProduct" карточки по которой кликнули **********/
events.on('catalog:product:select', (item: IProduct) => { catalog.setPreview(item) });

/********** Открываем модальное окно карточки товара **********/
events.on('modalCard:open', (item: IProduct) => {
  const productDetails = new ProductDetailsView(productDetailsTemplate, events)
  modal.content = productDetails.render(item);
  modal.render();
});

/********** Добавление карточки товара в корзину **********/
events.on('cart:item:add', () => {
  cartModel.addProduct(catalog.selectedProduct); // добавить карточку товара в корзину
  cart.renderHeaderCartCounter(cartModel.getItemCount()); // отобразить количество товара на иконке корзины
  modal.close();
});

/********** Открытие модального окна корзины **********/
events.on('cart:open', () => {
  cart.renderTotal(cartModel.getTotal());  // отобразить сумма всех продуктов в корзине
  let i = 0;
  cart.items = cartModel.products.map((item) => {
    const cartItem = new CartItemView(cartItemTemplate, events, { onClick: () => events.emit('cart:item:remove', item) });
    i = i + 1;
    return cartItem.render(item, i);
  })
  modal.content = cart.render();
  modal.render();
});

/********** Удаление карточки товара из корзины **********/
events.on('cart:item:remove', (item: IProduct) => {
  cartModel.removeProduct(item);
  cart.renderHeaderCartCounter(cartModel.getItemCount()); // отобразить количество товара на иконке корзины
  cart.renderTotal(cartModel.getTotal()); // отобразить сумма всех продуктов в корзине
  let i = 0;
  cart.items = cartModel.products.map((item) => {
    const cartItem = new CartItemView(cartItemTemplate, events, { onClick: () => events.emit('cart:item:remove', item) });
    i = i + 1;
    return cartItem.render(item, i);
  })
});

/********** Открытие модального окна "способа оплаты" и "адреса доставки" **********/
events.on('checkout:step:payment', () => {
  modal.content = paymentForm.render();
  modal.render();
  checkout.items = cartModel.products.map(item => item.id); // передаём список id товаров которые покупаем
});

events.on('checkout:payment:select', (button: HTMLButtonElement) => { checkout.payment = button.name }) // передаём способ оплаты

/********** Отслеживаем изменение в поле в вода "адреса доставки" **********/
events.on(`checkout:address:change`, (data: { field: string, value: string }) => {
  checkout.setAddress(data.field, data.value);
});

/********** Валидация данных строки "address" и payment **********/
events.on('checkout:validation:address', (errors: Partial<ICheckoutForm>) => {
  const { address, payment } = errors;
  paymentForm.valid = !address && !payment;
  paymentForm.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Email" и "Телефон" **********/
events.on('checkout:step:contacts', () => {
  checkout.total = cartModel.getTotal();
  modal.content = contactsForm.render();
  modal.render();
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on(`checkout:contacts:change`, (data: { field: string, value: string }) => {
  checkout.setContactData(data.field, data.value);
});

/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('checkout:validation:contacts', (errors: Partial<ICheckoutForm>) => {
  const { email, phone } = errors;
  contactsForm.valid = !email && !phone;
  contactsForm.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Заказ оформлен" **********/
events.on('checkout:process:submit', () => {
  api.submitOrder(checkout.getOrderData())
    .then((data) => {
      console.log(data); // ответ сервера
      const successView = new OrderSuccessView(successTemplate, events);
      modal.content = successView.render(cartModel.getTotal());
      cartModel.clear(); // очищаем корзину
      cart.renderHeaderCartCounter(cartModel.getItemCount()); // отобразить количество товара на иконке корзины
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('order:success:close', () => modal.close());

/********** Блокируем прокрутку страницы при открытие модального окна **********/
events.on('dialog:open', () => {
  modal.locked = true;
});

/********** Разблокируем прокрутку страницы при закрытие модального окна **********/
events.on('dialog:close', () => {
  modal.locked = false;
});

/********** Навешиваем обработчики на уже существующие элементы в статичном модальном окне **********/

document.querySelectorAll('.modal__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.close();
    });
});


// Работаем через таймаут, чтобы учесть загрузку стартовой карточки
setTimeout(() => {
  // Ищем стартовую карточку
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
    
    // Устанавливаем карточку как выбранную
    catalog.selectedProduct = startupCardData;
    
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
        // Добавляем товар в корзину
        cartModel.products.push(startupCardData);
        // Обновляем счетчик корзины
        cart.renderHeaderCartCounter(cartModel.getItemCount());
        // Закрываем модальное окно
        startupModal.classList.remove('modal_active');
      });
    }
  }
}, 100);


/********** Получаем данные с сервера **********/
api.getProducts()
  .then(function (data: IProduct[]) {
    catalog.products = data;
  })
  // .then(catalog.setProducts.bind(catalog))
  .catch(error => console.log(error))