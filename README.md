# Проектная работа "Веб-ларек"

## Описание проекта

**Web-ларёк** — это учебный интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать каталог, открывать карточки товаров, добавлять их в корзину и оформлять заказ. Данные приходят с внешнего API.

Проект реализован на **TypeScript** и построен на архитектурном паттерне **MVP (Model-View-Presenter)**. Компоненты приложения слабо связаны между собой и взаимодействуют через событийную систему `EventEmitter`, что обеспечивает масштабируемость и поддержку в долгосрочной перспективе.

---

## Установка и запуск

### Установка зависимостей

```bash
npm install
# или
yarn
```

### Запуск проекта

```bash
npm run start
# или
yarn start
```

### Сборка проекта

```bash
npm run build
# или
yarn build
```

---

## Архитектура проекта

Проект реализован по паттерну **MVP (Model-View-Presenter)**, где каждый слой имеет чётко определённую зону ответственности.

### Model (Модель)

Модели инкапсулируют бизнес-логику и хранят данные:

- **ProductCollectionModel** — управляет списком товаров и выбранным товаром.
- **ShoppingCartModel** — хранит добавленные в корзину товары, предоставляет методы управления.
- **CheckoutModel** — отвечает за сбор, валидацию и хранение данных заказа.

### View (Представление)

Компоненты View отвечают за визуальное отображение интерфейса и реагируют на действия пользователя:

- **ProductItemView** — базовая карточка товара.
- **ProductDetailsView** — карточка товара с подробным описанием.
- **ShoppingCartView** — отображение корзины покупок.
- **CartItemView** — отображение одного товара в корзине.
- **CheckoutPaymentView** — форма выбора оплаты.
- **CheckoutContactsView** — форма ввода контактных данных.
- **OrderSuccessView** — сообщение об успешном заказе.
- **ModalView** — универсальное модальное окно.

### Presenter (Презентер)

Презентеры управляют связью между Model и View:

- **CatalogPresenter** — управляет каталогом и взаимодействием с карточками товаров.
- **ShoppingCartPresenter** — управляет корзиной, обрабатывает события добавления и удаления товаров.
- **CheckoutPresenter** — управляет этапами оформления заказа и отправкой данных на сервер.

### Сервисы

- **WebLarekApi** — сервис для работы с API: получение списка товаров и отправка заказа.
- **Api** — базовый класс API-клиента.

---

## Структура проекта

```
src/
├── components/
│   ├── base/                # Базовые классы и утилиты
│   │   ├── api.ts
│   │   ├── events.ts
│   ├── Model/
│   ├── View/
│   ├── Presenters/
│   ├── Services/
├── types/
├── utils/
├── pages/
├── scss/
├── index.ts
```

---

## Модели (Model)

### ProductCollectionModel

Управляет списком товаров и выбранным товаром.

#### Конструктор:

```ts
constructor(events: IEvents)
```

#### Методы:

- `set products(data: IProduct[])` — обновляет список товаров.
- `get products()` — возвращает текущий список.
- `setPreview(item: IProduct)` — устанавливает выбранный товар и генерирует событие `modalCard:open`.

---

### ShoppingCartModel

Управляет корзиной: добавление, удаление, итоговая сумма.

#### Методы:

- `addProduct(product: IProduct)`
- `removeProduct(product: IProduct)`
- `getItemCount()`
- `getTotal()`
- `clear()`

---

### CheckoutModel

Собирает данные для оформления заказа и валидирует их.

#### Методы:

- `setAddress(field: string, value: string)`
- `validatePaymentStep()`
- `setContactData(field: string, value: string)`
- `validateContactsStep()`
- `getOrderData()`

---

## Представления (View)

Каждое представление реализует метод `render()` и работает со своей частью DOM.

### ProductItemView

- `render(data: IProduct)`
- `set cardCategory(value: string)`

### ProductDetailsView

- `render(data: IProduct)`
- `isForSale(data: IProduct)`

### ShoppingCartView

- `set items(items: HTMLElement[])`
- `renderHeaderCartCounter(value: number)`
- `renderTotal(total: number)`
- `render()`

### CartItemView

- `render(data: IProduct, index: number)`

### CheckoutPaymentView

- `set paymentSelection(value: string)`
- `set valid(value: boolean)`
- `render()`

### CheckoutContactsView

- `set valid(value: boolean)`
- `render()`

### OrderSuccessView

- `render(total: number)`

### ModalView

- `set content(value: HTMLElement)`
- `open()`, `close()`, `render()`
- `set locked(value: boolean)`

---

## Презентеры (Presenter)

### CatalogPresenter

- Загружает товары.
- Рендерит карточки.
- Открывает модалку с подробностями.

### ShoppingCartPresenter

- Добавление и удаление товаров.
- Счётчик и обновление UI.

### CheckoutPresenter

- Валидация форм.
- Отправка заказа.
- Переходы по шагам.

---

## Классы API

### Api

Базовый класс для HTTP-запросов.

#### Методы:

- `get(uri: string)`
- `post(uri: string, data: object, method: 'POST' | 'PUT' | 'DELETE')`
- `handleResponse(response: Response)`

---

### WebLarekApi

Расширяет `Api` для работы с товарами и заказами.

#### Методы:

- `getProducts()`
- `submitOrder(order: ICheckoutSubmission)`

---

## Типы данных

```ts
interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ICartItem {
  productId: string;
  quantity: number;
}

interface ICheckoutForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

interface ICheckoutSubmission {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

interface ICheckoutResult {
  id: string;
  total: number;
}
```

---

## События

- `modal:open`, `modal:close`
- `productCards:receive`, `modalCard:open`
- `cart:item:add`, `cart:item:remove`
- `checkout:payment:select`, `checkout:contacts:valid`
- `success:open`, `success:close`

---
