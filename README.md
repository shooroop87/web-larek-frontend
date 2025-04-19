# Проектная работа "Веб-ларек"

## Описание проекта

**Web-ларёк** — это учебный интернет-магазин, разработанный на TypeScript, предназначенный для демонстрации архитектурных подходов и разделения ответственности между компонентами. Пользователь может просматривать список товаров, открывать подробную информацию, добавлять товары в корзину и оформлять заказ. Взаимодействие с сервером реализовано через REST API.

Проект построен по архитектурному паттерну **MVP (Model-View-Presenter)**. Такой подход обеспечивает масштабируемость, переиспользуемость компонентов и слабую связанность между слоями приложения.

---

## Инструкция по запуску проекта

### Установка зависимостей

```bash
npm install
# или
yarn
```

### Запуск проекта в режиме разработки

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

## Взаимодействие между компонентами

Коммуникация между слоями осуществляется через собственный брокер событий **EventEmitter**. Все компоненты подписываются на события и реагируют на них независимо друг от друга. Это позволяет легко расширять функциональность без изменения текущего кода.

Примеры взаимодействий:

- Выбор товара → `ProductDetailsView` открывается через `CatalogPresenter`, отображая данные из `ProductCollectionModel`.
- Нажатие "Купить" → `ShoppingCartPresenter` добавляет товар из модели в корзину и обновляет `ShoppingCartView`.
- Отправка формы → `CheckoutPresenter` получает данные из модели и передаёт их в `WebLarekApi`.

---

## Структура проекта

```
src/
├── components/
│   ├── base/                # Базовые классы и инфраструктура
│   │   ├── api.ts           # Базовый API-клиент
│   │   ├── events.ts        # EventEmitter
│   ├── Model/               # Модели данных
│   │   ├── ProductCollectionModel.ts
│   │   ├── ShoppingCartModel.ts
│   │   ├── CheckoutModel.ts
│   ├── Presenters/          # Презентеры
│   │   ├── CatalogPresenter.ts
│   │   ├── ShoppingCartPresenter.ts
│   │   ├── CheckoutPresenter.ts
│   ├── Services/            # Работа с API
│   │   ├── WebLarekApi.ts
│   ├── View/                # Компоненты представления
│   │   ├── ProductItemView.ts
│   │   ├── ProductDetailsView.ts
│   │   ├── ShoppingCartView.ts
│   │   ├── CartItemView.ts
│   │   ├── CheckoutPaymentView.ts
│   │   ├── CheckoutContactsView.ts
│   │   ├── OrderSuccessView.ts
│   │   ├── ModalView.ts
├── types/                   # Типы и интерфейсы
│   ├── index.ts
├── utils/                   # Утилиты и константы
│   ├── constants.ts
│   ├── utils.ts
├── pages/
│   ├── index.html           # Разметка приложения
├── scss/                    # Стили
├── index.ts                 # Инициализация приложения
```

---

## Описание типов данных

```ts
// Интерфейс товара
interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// Элемент в корзине
interface ICartItem {
  productId: string;
  quantity: number;
}

// Форма оформления заказа (пошаговая)
interface ICheckoutForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

// Полные данные заказа
interface ICheckoutSubmission {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Ответ от сервера после оформления
interface ICheckoutResult {
  id: string;
  total: number;
}
```

---

## Программный интерфейс компонентов

### View-компоненты

Каждый класс View реализует метод `render()` и работает только со своей частью DOM. Все используемые элементы кэшируются в конструкторе, повторный поиск исключён. Пользовательские действия передаются через события.

Примеры методов:

```ts
render(): HTMLElement         // отрисовывает интерфейс
set valid(value: boolean)    // изменяет доступность кнопки
set content(value: HTMLElement) // вставка контента в модальное окно
```

### EventEmitter

Собственная реализация брокера событий для организации слабосвязанных компонентов.

Методы:

```ts
on(event: string, callback: Function): void
off(event: string, callback: Function): void
emit(event: string, payload?: any): void
```

---

## Соответствие кода и документации

- Архитектура следует принципам **единственной ответственности**: каждый класс занимается только своей задачей.
- Все взаимодействия между слоями происходят через события или внедрение зависимостей.
- Все типы описаны и типизированы. Тип `any` не используется.
- Компоненты не делают прямые запросы к API — этим занимаются сервисы.
- Повторяющиеся части кода вынесены в утилиты.
- Интерфейсы строго соответствуют передаваемым структурам.

---

## Применённые паттерны

- **MVP (Model-View-Presenter)** — основа архитектуры.
- **Observer** — через EventEmitter.
- **Dependency Injection** — передача зависимостей через конструкторы.
- **Single Responsibility Principle (SRP)** — соблюдён на уровне всех классов.
- **Separation of Concerns** — каждый слой (Model, View, Presenter) изолирован и легко заменяем.

---