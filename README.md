# Проектная работа "Веб-ларек"

## Описание проекта

**Web-ларёк** — это учебный интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать каталог, открывать карточки товаров, добавлять их в корзину и оформлять заказ. Данные приходят с внешнего API. 

Проект построен на TypeScript с использованием архитектурного паттерна **MVP (Model-View-Presenter)**. Компоненты слабо связаны между собой и взаимодействуют через событийную систему `EventEmitter`, что обеспечивает масштабируемость и поддержку в долгосрочной перспективе.

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
│   │   ├── api.ts           # Базовый API-клиент
│   │   ├── events.ts        # EventEmitter
│   ├── Model/               # Модели
│   ├── View/                # Интерфейсные компоненты
│   ├── Presenters/          # Презентеры
│   ├── Services/            # Работа с внешними API
├── types/                   # Типы данных
├── utils/                   # Утилиты и константы
├── pages/                   # HTML-шаблоны
├── scss/                    # Стили
├── index.ts                 # Инициализация приложения
```

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

## EventEmitter

Собственный брокер событий между компонентами. Реализует паттерн **Observer**.

### Методы:

```ts
on(event: string, callback: Function): void
off(event: string, callback: Function): void
emit(event: string, payload?: any): void
onAll(callback: Function): void
offAll(): void
```

---

## Примеры взаимодействий

- Пользователь кликает на товар → `CatalogPresenter` открывает модалку через `ProductDetailsView`.
- Нажатие на "Купить" → `ShoppingCartPresenter` добавляет товар в модель корзины и обновляет `ShoppingCartView`.
- Пользователь заполняет форму → `CheckoutPresenter` валидирует данные и отправляет заказ через `WebLarekApi`.

---

## Класс `Api`

Базовый класс для API-запросов.

### Конструктор

```ts
constructor(baseUrl: string, options: RequestInit = {})
```

### Свойства

- `baseUrl: string` — базовый URL.
- `options: RequestInit` — заголовки и конфигурация.

### Методы

```ts
protected handleResponse(response: Response): Promise<object>
get(uri: string): Promise<object>
post(uri: string, data: object, method: 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<object>
```

---

## Класс `WebLarekApi`

Наследуется от `Api`.

### Методы:

```ts
getProducts(): Promise<IProduct[]>
submitOrder(order: ICheckoutSubmission): Promise<ICheckoutResult>
```

---

## Классы моделей

### ProductCollectionModel

- `products: IProduct[]`
- `selectedProduct: IProduct`

```ts
set products(data: IProduct[]): void
get products(): IProduct[]
setPreview(item: IProduct): void
```

---

### ShoppingCartModel

- `products: IProduct[]`

```ts
addProduct(product: IProduct): void
removeProduct(product: IProduct): void
getItemCount(): number
getTotal(): number
clear(): void
```

---

### CheckoutModel

```ts
setAddress(field: string, value: string): void
setContactData(field: string, value: string): void
validatePaymentStep(): boolean
validateContactsStep(): boolean
getOrderData(): object
```

---

## View-компоненты

Каждый View реализует `render()` и взаимодействует с DOM.

### ProductItemView

Базовая карточка товара.

```ts
render(data: IProduct): HTMLElement
```

---

### ProductDetailsView

Подробная карточка товара. Наследуется от `ProductItemView`.

```ts
render(data: IProduct): HTMLElement
isForSale(data: IProduct): string
```

---

### ShoppingCartView

```ts
set items(items: HTMLElement[]): void
renderHeaderCartCounter(value: number): void
renderTotal(total: number): void
render(): HTMLElement
```

---

### CartItemView

```ts
render(data: IProduct, index: number): HTMLElement
```

---

### CheckoutPaymentView

```ts
set paymentSelection(paymentMethod: string): void
set valid(value: boolean): void
render(): HTMLElement
```

---

### CheckoutContactsView

```ts
set valid(value: boolean): void
render(): HTMLElement
```

---

### OrderSuccessView

```ts
render(total: number): HTMLElement
```

---

### ModalView

```ts
set content(value: HTMLElement): void
open(): void
close(): void
set locked(value: boolean): void
render(): HTMLElement
```

---

## Презентеры

### CatalogPresenter

```ts
constructor(events, model, api, templateCard, templatePreview)
```

- Получает товары
- Рендерит каталог
- Открывает модалку с карточкой

---

### ShoppingCartPresenter

```ts
constructor(events, cartModel, catalogModel, cartView, cartItemTemplate, modal)
```

- Добавление и удаление из корзины
- Обновление UI
- Счётчик и общая сумма

---

### CheckoutPresenter

```ts
constructor(events, checkoutModel, cartModel, api, paymentView, contactsView, successTemplate, modal)
```

- Пошаговая валидация
- Сбор и отправка данных
- Очистка корзины

---

## События

- `modal:open`, `modal:close`
- `product:select`, `cart:item:add`, `cart:item:remove`
- `checkout:payment:select`, `checkout:contacts:valid`, `success:open`

---

## Применённые паттерны

- **MVP (Model-View-Presenter)** — основа архитектуры.
- **Observer** — через `EventEmitter`.
- **Dependency Injection** — зависимости передаются через конструктор.
- **Single Responsibility Principle** — каждый класс решает одну задачу.

---