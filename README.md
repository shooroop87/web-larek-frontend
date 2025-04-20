# Проектная работа "Веб-ларек"

## Описание проекта

**WWeb-ларёк — это учебный интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать товары, добавлять их в корзину и оформлять заказ.

Проект реализован на основе паттерна **MVP (Model-View-Presenter)** с акцентом на слабую связанность и масштабируемость.

---

## Установка и запуск

### Установка зависимостей

```shell
npm install
# или
yarn
```

### Запуск проекта в режиме разработки

```shell
npm run start
# или
yarn start
```

### Сборка проекта

```shell
npm run build
# или
yarn build
```

---

## Архитектура проекта

Проект построен по паттерну **MVP (Model-View-Presenter)**:

### Model (Модель)

Модели управляют состоянием данных и их валидацией:

- `ProductCollectionModel` — список товаров и текущий выбранный товар.
- `ShoppingCartModel` — товары в корзине, итоговая сумма и очистка.
- `CheckoutModel` — данные заказа, пошаговая валидация и сбор информации.

### View (Представление)

Компоненты интерфейса, реагирующие на действия пользователя:

- `ProductItemView` — карточка товара.
- `ProductDetailsView` — карточка с подробностями и кнопкой покупки.
- `ShoppingCartView` — отображение модального окна корзины.
- `CartItemView` — отображение одного товара в списке корзины.
- `CheckoutPaymentView` — форма выбора оплаты.
- `CheckoutContactsView` — форма ввода контактной информации.
- `OrderSuccessView` — окно успешного оформления.
- `ModalView` — универсальное модальное окно.

### Presenter (Презентер)

Промежуточное звено между Model и View:

- `CatalogPresenter` — отображение карточек товаров, открытие подробностей.
- `ShoppingCartPresenter` — управление корзиной.
- `CheckoutPresenter` — оформление заказа, валидация и отправка.

### Сервисы

- `WebLarekApi` — взаимодействие с API: получение списка товаров и отправка заказа.
- `Api` — базовый HTTP-клиент.

---

## Структура проекта

```
src/
├── components/
│   ├── base/                # Базовые классы
│   ├── Model/               # Модели данных
│   ├── View/                # Интерфейсные компоненты
│   ├── Presenters/          # Бизнес-логика
│   ├── Services/            # API-клиенты
├── types/                   # Типы и интерфейсы
├── utils/                   # Утилиты и константы
├── pages/                   # HTML
├── scss/                    # Стили
├── index.ts                 # Инициализация и связывание всех слоёв
```

---

## View-компоненты

### `ProductItemView`

**Назначение**: отображение карточки товара.

**Методы**:

- `render(data: IProduct): HTMLElement` — отрисовка товара.
- `set cardCategory(value: string): void` — установка категории с CSS-классом.
- `setPrice(value: number | null): string` — форматирование цены.

---

### `ProductDetailsView`

**Наследуется от**: `ProductItemView`.

**Дополнительно**:

- `addToCartButton: HTMLElement` — кнопка "Купить".
- `description: HTMLElement` — описание товара.

**Методы**:

- `render(data: IProduct): HTMLElement`
- `isForSale(data: IProduct): string` — определяет доступность товара.

---

### `ShoppingCartView`

**Назначение**: отображение модального окна корзины.

**Методы**:

- `set items(items: HTMLElement[])`
- `renderHeaderCartCounter(value: number)`
- `renderTotal(total: number)`
- `render(): HTMLElement`

**Элементы**:

- `cartList` — список товаров.
- `checkoutButton` — кнопка оформления.
- `headerCartCounter` — счетчик в шапке.

---

### `CartItemView`

**Назначение**: отображение одного товара в корзине.

**Методы**:

- `render(data: IProduct, index: number): HTMLElement`

**Элементы**:

- `title`, `price`, `removeButton`, `index`

---

### `CheckoutPaymentView`

**Назначение**: форма выбора способа оплаты.

**Методы**:

- `set paymentSelection(value: string)`
- `set valid(value: boolean)`
- `render()`

**Особенности**:

- Кнопки оплаты переключаются по клику.

---

### `CheckoutContactsView`

**Назначение**: форма ввода email и телефона.

**Методы**:

- `set valid(value: boolean)`
- `render()`
- обрабатывает submit формы и эмиттит событие `checkout:process:submit`

---

### `OrderSuccessView`

**Назначение**: отображение экрана успеха.

**Методы**:

- `render(data: { total: number }): HTMLElement`
- `setCloseHandler(callback: () => void)` — задаёт поведение при закрытии окна успеха

---

### `ModalView`

**Назначение**: универсальное модальное окно.

**Методы**:

- `set content(value: HTMLElement)`
- `open()`, `close()`
- `render()`
- `set locked(value: boolean)`

---

## Презентеры

### `CatalogPresenter`

**Задачи**:

- Получение товаров от API.
- Отображение карточек каталога.
- Открытие подробностей товара в модалке.

**Конструктор**:

```
constructor(events, model, api, templateCard, templatePreview)
```

---

### `ShoppingCartPresenter`

**Задачи**:

- Обработка событий "добавить/удалить".
- Обновление представления корзины.
- Поддержка счетчика и итога.

**Конструктор**:

```
constructor(events, cartModel, catalogModel, cartView, itemTemplate, modal)
```

---

### `CheckoutPresenter`

**Задачи**:

- Управление шагами оформления.
- Валидация форм.
- Отправка данных на сервер.
- После успешной отправки — эмиттит `checkout:success:show`

**Конструктор**:

```
constructor(events, checkoutModel, cartModel, api, paymentView, contactsView, successTemplate, modal)
```

---

## Сервисы

### Класс `Api`

Базовый HTTP-клиент.

**Методы**:

- `get(uri: string): Promise<object>`
- `post(uri: string, data: object, method = 'POST'): Promise<object>`
- `handleResponse(response: Response): Promise<object>`

---

### Класс `WebLarekApi`

Наследуется от `Api`.

**Методы**:

- `getProducts(): Promise<IProduct[]>`
- `submitOrder(order: ICheckoutSubmission): Promise<ICheckoutResult>`

---

## Типы данных

```
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

Коммуникация реализована через `EventEmitter`.

**Примеры событий**:

- `modal:open`, `modal:close`
- `modalCard:open`
- `productCards:receive`
- `cart:item:add`, `cart:item:remove`, `cart:changed`
- `checkout:step:payment`, `checkout:step:contacts`
- `checkout:payment:select`, `checkout:contacts:change`
- `checkout:validation:contacts`, `checkout:validation:address`
- `checkout:process:submit`
- `checkout:success:show`, `order:success:close`

---

## Логика взаимодействия компонентов

1. `index.ts` связывает все компоненты и презентеры.
2. Пользователь кликает на карточку — `CatalogView` эмиттит `modalCard:open`.
3. `CatalogPresenter` создаёт `ProductDetailsView` и передаёт его в модалку.
4. Кнопка "В корзину" — `ShoppingCartPresenter` обновляет `ShoppingCartModel`, `cartView`, счётчик.
5. Открытие корзины эмиттит `cart:open`, отображается `ShoppingCartView`.
6. Кнопка "Оформить" вызывает этап `checkout:step:payment`, далее `checkout:step:contacts`.
7. `CheckoutPresenter` валидирует ввод через модель, слушает `checkout:process:submit`.
8. Успешная отправка вызывает `checkout:success:show`, `OrderSuccessView` отображается в модалке.

Все шаги работают через события `EventEmitter` без прямых вызовов между слоями.
