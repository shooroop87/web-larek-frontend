# Проектная работа "Веб-ларек"

## Описание проекта
Web-ларёк — это учебный интернет-магазин с товарами для веб-разработчиков. 
Пользователь может просматривать товары, добавлять их в корзину и оформлять заказ.
Проект реализован на основе паттерна **MVP (Model-View-Presenter)** с акцентом на слабую связанность и масштабируемость.

## Архитектура проекта

Проект реализован по паттерну **MVP (Model-View-Presenter)**:

* **Model (Модель)** — отвечает за хранение, обработку и валидацию данных:
  * `ProductCollectionModel` — управляет коллекцией товаров
  * `ShoppingCartModel` — отвечает за работу с корзиной покупок
  * `CheckoutModel` — управляет данными заказа и их валидацией

* **View (Представление)** — отображает интерфейс и реагирует на действия пользователя:
  * `ProductItemView` — отвечает за отображение отдельного товара
  * `ProductDetailsView` — показывает подробную информацию о товаре
  * `ShoppingCartView` — отображает корзину
  * `CheckoutPaymentView` и `CheckoutContactsView` — формы оформления заказа
  * `ModalView` — управляет модальными окнами

* **Presenter (Презентер)** — выполняет роль посредника между Model и View, управляет бизнес-логикой приложения и реакцией на события:
  * `CatalogPresenter` — управление каталогом товаров и просмотром деталей
  * `ShoppingCartPresenter` — управление корзиной покупок
  * `CheckoutPresenter` — управление процессом оформления заказа

* **Services (Сервисы)** — дополнительный слой для работы с внешними API:
  * `WebLarekApi` — клиент для взаимодействия с серверным API

Компоненты взаимодействуют через **EventEmitter** (брокер событий).

## Используемый стек:

- HTML
- SCSS
- TypeScript
- Webpack

## Структура проекта
src/ — исходные файлы проекта
├── components/ — UI-компоненты и логика
│   ├── base/ — базовые абстракции и утилиты
│   │   ├── api.ts — базовый класс для работы с API
│   │   ├── events.ts — брокер событий (EventBus)
│   ├── Model/ — модели данных
│   │   ├── ProductCollectionModel.ts — модель каталога товаров
│   │   ├── ShoppingCartModel.ts — модель корзины покупок
│   │   ├── CheckoutModel.ts — модель оформления заказа
│   ├── Presenters/ — презентеры
│   │   ├── CatalogPresenter.ts — презентер каталога товаров
│   │   ├── ShoppingCartPresenter.ts — презентер корзины покупок
│   │   ├── CheckoutPresenter.ts — презентер оформления заказа
│   ├── Services/ — сервисы
│   │   ├── WebLarekApi.ts — клиент для взаимодействия с API
│   ├── View/ — представления
│   │   ├── ProductItemView.ts — представление карточки товара
│   │   ├── ProductDetailsView.ts — представление детальной информации о товаре
│   │   ├── ShoppingCartView.ts — представление корзины
│   │   ├── CartItemView.ts — представление товара в корзине
│   │   ├── CheckoutPaymentView.ts — представление формы оплаты
│   │   ├── CheckoutContactsView.ts — представление формы контактов
│   │   ├── OrderSuccessView.ts — представление успешного оформления заказа
│   │   ├── ModalView.ts — представление модального окна
├── types/ — типы и интерфейсы
│   ├── index.ts — основные типы данных
├── utils/ — утилиты
│   ├── constants.ts — константы приложения
│   ├── utils.ts — вспомогательные функции
├── pages/index.html — разметка приложения
├── scss/ — стили
├── index.ts — корневой файл инициализации

## Инструкция по сборке и запуску проекта

```bash
npm install
npm run start
# или
yarn
yarn start
```

## Сборка
```bash
npm run build
# или
yarn build
```


## Типы данных

### Продукты
```
// Интерфейс для товара
interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// Интерфейс для товара в корзине
interface ICartItem {
  productId: string;
  quantity: number;
}

// Базовый интерфейс для формы оформления заказа
interface ICheckoutForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

// Данные для отправки заказа
interface ICheckoutSubmission {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Результат оформления заказа
interface ICheckoutResult {
  id: string;
  total: number;
}
```

## Базовые классы (components/base/)

### Component<T>
Абстрактный базовый класс для компонентов отображения.

Свойства:
- `protected readonly container: HTMLElement`

Конструктор:
```ts
protected constructor(container: HTMLElement)
```


Методы:
```ts
toggleClass(element: HTMLElement, className: string, force?: boolean): void
setText(element: HTMLElement, value: unknown): void
setDisabled(element: HTMLElement, state: boolean): void
setHidden(element: HTMLElement): void
setVisible(element: HTMLElement): void
setImage(element: HTMLImageElement, src: string, alt?: string): void
render(data?: Partial<T>): HTMLElement
```

### Model<T> (опционально)
Базовый класс модели данных.

Свойства:
- `protected data: T`

Конструктор:
```ts
constructor(initialData: T)
```

Методы:
```ts
getData(): T
setData(data: T): void
```

### EventEmitter implements IEvents

Служит брокером событий между компонентами.

Свойства:
- `_events: Map<EventName, Set<Subscriber>>`

Методы:
```ts
on<T extends object>(event: EventName, callback: (data: T) => void): void
off(event: EventName, callback: Subscriber): void
emit<T extends object>(event: string, data?: T): void
onAll(callback: (event: EmitterEvent) => void): void
offAll(): void
trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void
```

---

## Модель (models/)

### CatalogModel
Хранит список товаров и ID выбранного товара.

Свойства:
- `products: IProduct[]`
- `selectedProductId: string | null`

Методы:
```ts
setProducts(products: IProduct[]): void
getProducts(): IProduct[]
selectProduct(id: string): void
getSelected(): IProduct | null
```

### CartModel
Управляет корзиной.

Свойства:
- `items: Map<string, ICartItem>`

Методы:
```ts
addItem(product: IProduct): void
removeItem(productId: string): void
hasItem(productId: string): boolean
getItems(): ICartItem[]
clear(): void
getTotalPrice(): number
```

### OrderModel
Собирает данные заказа и валидирует шаги.

Свойства:
- `payment: string | null`
- `address: string | null`
- `email: string | null`
- `phone: string | null`
- `items: string[]`

Методы:
```ts
isValidStepOne(): boolean
isValidStepTwo(): boolean
submit(): IOrder
```

---

## View (components/views/)

Каждый класс реализует `Component<T>` и отвечает за определённую часть интерфейса.

- `ProductCardView` — карточка товара
- `CartView` — корзина
- `OrderFormView` — оформления заказа
- `ModalView` — модальное окно

---

## Presenter (components/presenters/)

### ProductPresenter
Управляет карточками товаров и открытием модалки.

### CartPresenter
Управляет корзиной, обновляет представление и удаляет товары.

### OrderPresenter
Управляет шагами оформления заказа и отправкой данных.

---

## События приложения

### События View
- `product:click`
- `modal:close`
- `cart:remove`
- `order:next`

### События Model
- `product:add`
- `order:start`
- `order:submit`

---

## Сервисы

### WebLarekApi

Сервисный клиент, использующий базовый класс `Api`.

Методы:
```ts
getProducts(): Promise<IProduct[]>
getProduct(id: string): Promise<IProduct>
sendOrder(order: IOrder): Promise<{ success: boolean }>
```

### Утилиты
constants.ts
Содержит списки категорий, статусы, названия шагов, иконки и т.д.

utils.ts
- createElement(html: string): HTMLElement
- formatPrice(price: number): string
- validateEmail(email: string): boolean
- validatePhone(phone: string): boolean

## Основной инициализатор (index.ts)

Создаёт экземпляры моделей, вью, презентеров и связывает их через EventEmitter, а также запускает приложение.
