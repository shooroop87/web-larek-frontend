import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { IProduct } from '../types';

export class Card extends Component<HTMLElement> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _button: HTMLElement | null;
  protected _description: HTMLElement | null;

  constructor(container: HTMLElement, protected eventEmitter: EventEmitter) {
    super(container);

    this._title = container.querySelector('.card__title') as HTMLElement;
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    this._price = container.querySelector('.card__price') as HTMLElement;
    this._category = container.querySelector('.card__category') as HTMLElement;
    this._button = container.querySelector('.card__button');
    this._description = container.querySelector('.card__text');
    
    // Добавляем обработчики событий
    if (this._button) {
      this.on(this._button, 'click', this.handleButtonClick.bind(this));
    }

    this.on(container, 'click', this.handleCardClick.bind(this));
  }

  /**
   * Обработчик клика по карточке
   */
  private handleCardClick(event: MouseEvent): void {
    // Если клик был по кнопке, не обрабатываем событие клика по карточке
    if (this._button && (event.target === this._button || this._button.contains(event.target as Node))) {
      return;
    }

    const id = this.container.dataset.id;
    if (id) {
      console.log('Card click, id:', id);
      
      // Собираем данные о товаре из DOM-элементов
      const product: IProduct = {
        id,
        title: this._title.textContent || '',
        price: this.extractPrice(this._price.textContent || ''),
        image: this._image.src,
        category: this._category?.textContent || 'другое',
        description: this._description?.textContent || '',
        inBasket: this.container.dataset.inBasket === 'true'
      };
      
      // Генерируем событие выбора карточки
      this.eventEmitter.emit('card:select', product);
    }
  }

  /**
   * Обработчик клика по кнопке карточки
   */
  private handleButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    const id = this.container.dataset.id;
    
    if (id) {
      console.log('Button click, id:', id, 'inBasket:', this.container.dataset.inBasket);
      
      if (this.container.dataset.inBasket === 'true') {
        // Если товар уже в корзине, удаляем его
        this.eventEmitter.emit('card:remove', { id });
        this.container.dataset.inBasket = 'false';
        if (this._button) {
          this._button.textContent = 'В корзину';
        }
      } else {
        // Если товара нет в корзине, добавляем его
        this.eventEmitter.emit('card:add', { id });
        this.container.dataset.inBasket = 'true';
        if (this._button) {
          this._button.textContent = 'Удалить';
        }
      }
    }
  }

  /**
   * Извлечение числового значения цены из строки
   */
  private extractPrice(priceText: string): number | null {
    const match = priceText.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  /**
   * Отрисовать карточку товара
   */
  render(product: IProduct): HTMLElement {
    this.container.dataset.id = product.id;
    this.container.dataset.inBasket = String(!!product.inBasket);
    
    this.setText(this._title, product.title);
    this.setImage(this._image, product.image, product.title);
    
    // Устанавливаем цену
    if (product.price === null) {
      this.setText(this._price, 'Бесценно');
    } else {
      this.setText(this._price, `${product.price} синапсов`);
    }
    
    // Устанавливаем категорию, если есть элемент категории
    if (this._category) {
      this.setText(this._category, product.category);
      // Удаляем все классы категорий
      this._category.className = 'card__category';
      
      // Добавляем класс для конкретной категории
      // Преобразуем категорию для использования в имени класса
      const categoryClass = product.category
        .toLowerCase()
        .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
        .replace(/[^\w\-]/g, ''); // Удаляем все кроме букв, цифр, подчеркиваний и дефисов
        
      if (categoryClass) {
        this._category.classList.add(`card__category_${categoryClass}`);
      }
    }
    
    // Устанавливаем описание, если есть элемент описания и описание товара
    if (this._description && product.description) {
      this.setText(this._description, product.description);
    }
    
    // Устанавливаем текст на кнопке
    if (this._button) {
      this._button.textContent = product.inBasket ? 'Удалить' : 'В корзину';
    }
    
    return this.container;
  }
}