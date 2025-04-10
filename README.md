# Проектная работа "Веб-ларек"

## Описание проекта
Web-ларёк — это учебный интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать товары, добавлять их в корзину и оформлять заказ.
Проект реализован на основе паттерна **MVP (Model-View-Presenter)** с акцентом на слабую связанность и масштабируемость.

## Стек:

- HTML
- SCSS
- TypeScript
- Webpack

## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск проекта
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

В архитектуре приложения используем MVP-подход.

Model (models/)
ProductModel — содержит данные о товаре.

CartModel — хранит товары, добавленные в корзину.

OrderModel — собирает данные заказа.

View (components/views/)
ProductCardView — карточка товара.

ModalView — базовое модальное окно.

CartView — отображение корзины.

OrderFormView — формы оформления заказа.

Presenter (components/presenters/)
ProductPresenter — управляет отображением и взаимодействием с карточками товаров.

CartPresenter — управляет корзиной.

OrderPresenter — обрабатывает оформление заказа.

## Взаимодействие компонентов
Все связи между компонентами организуются через EventEmitter (брокер событий).

Компоненты подписываются на события (например, product:add, cart:remove, order:submit)

Presenter вызывает события, View реагирует


## Базовые классы (base/)
ViewComponent — абстрактный базовый класс для всех компонентов интерфейса.

ModalComponent — базовый компонент модальных окон.

EventEmitter — простой брокер событий.

## Описание архтектуры проекта по слоям:

### Модель (Model)

#### ProductModel

Отвечает за данные одного товара.

Поля:
- id: string
- title: string
- price: number
- description: string
- category: string
- image: string

Методы:
нет логики, только хранение данных (используется как структура)

#### CartModel

Управляет состоянием корзины.

Поля:
- items: Map<string, ICartItem>

Методы:
- addItem(product: IProduct): void — добавляет товар в корзину.
- removeItem(productId: string): void — удаляет товар из корзины.
- hasItem(productId: string): boolean — проверяет наличие товара.
- getItems(): ICartItem[] — возвращает все товары.
- clear(): void — очищает корзину.
- getTotalPrice(): number — считает итоговую сумму.


#### OrderModel

Хранит данные о текущем заказе.

Поля:
- payment: string | null
- address: string | null
- email: string | null
- phone: string | null
- items: string[]

Методы:
- isValidStepOne(): boolean — проверка, что выбран способ оплаты и введён адрес.
- isValidStepTwo(): boolean — проверка, что email и телефон указаны.
- submit(): IOrder — собирает заказ и возвращает его в виде объекта.

### Интерфейс (View)

#### ProductCardView

Отображает одну карточку товара.

Поля:
- element: HTMLElement — DOM-элемент карточки
- product: IProduct

Методы:
- render(product: IProduct): void — рендерит карточку.
- bindClick(handler: () => void): void — вешает обработчик на клик по карточке.
- setActive(isActive: boolean): void — визуально выделяет добавление в корзину.

#### CartView
Показывает корзину и список товаров.

Поля:
- element: HTMLElement
- items: ICartItem[]

Методы:
- render(items: ICartItem[]): void — рендерит содержимое корзины.
- bindRemove(handler: (id: string) => void): void — обработчик удаления товара.
- show(): void
- hide(): void


#### OrderFormView
Показывает форму оформления заказа.

Методы:
- renderStepOne(payment: string, address: string): void
- renderStepTwo(email: string, phone: string): void
- bindStepOneChange(handler: (data: {payment: string, address: string}) => void): void
- bindStepTwoChange(handler: (data: {email: string, phone: string}) => void): void
- bindSubmit(handler: () => void): void
- showError(message: string): void
- clear(): void


#### ModalView

Универсальное модальное окно.

Поля:
- element: HTMLElement
- content: HTMLElement

Методы:
- setContent(content: HTMLElement): void
- show(): void
- hide(): void
- bindClose(handler: () => void): void

### Презентеры (Presenter)

#### ProductPresenter

Управляет отображением карточек товаров и взаимодействием с модалкой.

Поля:
- view: ProductCardView
- modal: ModalView
- emitter: EventEmitter

Методы:
- showProduct(product: IProduct): void
- bindEvents(): void — подписка на клики, открытие товара, покупку.

#### CartPresenter

Управляет корзиной и взаимодействием с CartModel.

Поля:
- model: CartModel
- view: CartView
- emitter: EventEmitter

Методы:
- updateCart(): void
- bindEvents(): void

removeProduct(productId: string): void

#### OrderPresenter

Управляет процессом оформления заказа.

Поля:
- model: OrderModel
- view: OrderFormView
- cartModel: CartModel
- emitter: EventEmitter

Методы:
- startOrder(): void — запускает оформление.
- nextStep(): void — переходит ко 2 шагу.
- submit(): void — отправляет заказ, очищает корзину.
- bindEvents(): void

### Базовые классы (components/base/)

#### ViewComponent

Абстрактный базовый класс для всех View

Поля:
- element: HTMLElement

Методы:
- bind(selector: string): HTMLElement — упрощённый поиск элементов.
- toggle(show: boolean): void

#### EventEmitter

Служит брокером событий между компонентами.

Поля:
- listeners: { [eventName: string]: Function[] }

Методы:
- on(event: string, handler: Function): void
- off(event: string, handler: Function): void
- emit(event: string, payload?: any): void

### Утилиты
constants.ts
Содержит списки категорий, статусы, названия шагов, иконки и т.д.

utils.ts
- createElement(html: string): HTMLElement
- formatPrice(price: number): string
- validateEmail(email: string): boolean
- validatePhone(phone: string): boolean