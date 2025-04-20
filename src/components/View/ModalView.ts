import { IEvents } from "../base/events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

// Интерфейс для данных модального окна
interface IModalData {
  content: HTMLElement;
}

// Интерфейс для представления модального окна
export interface IModalView {
  open(): void;
  close(): void;
  render(data?: IModalData): HTMLElement;
  content: HTMLElement;
  locked: boolean;
}

// Класс для представления модального окна
export class ModalView extends Component<IModalData> implements IModalView {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _container: HTMLElement;
  protected _pageWrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this._container = container;
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
    
    // Закрытие по кнопке
    this._closeButton.addEventListener('click', this.close.bind(this));
    
    // Закрытие по клику вне модального окна
    this._container.addEventListener('click', this.close.bind(this));
    
    // Предотвращение закрытия при клике на контент
    ensureElement<HTMLElement>('.modal__container', container).addEventListener('click', 
      event => event.stopPropagation()
    );
    
    // Обработка события modal:open из других компонентов
    this.events.on('modal:open', (content: HTMLElement) => {
      if (content) {
        this.content = content;
      }
      
      // Не вызываем open() здесь, чтобы избежать рекурсии
      this._container.classList.add('modal_active');
    });
  }

  // Сеттер контента модального окна
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  // Открытие модального окна
  open(): void {
    this._container.classList.add('modal_active');
    // Не генерируем событие modal:open здесь, чтобы избежать рекурсии
  }

  // Закрытие модального окна
  close(): void {
    this._container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  // Сеттер блокировки страницы
  set locked(value: boolean) {
    if (value) {
      this._pageWrapper.classList.add('page__wrapper_locked');
    } else {
      this._pageWrapper.classList.remove('page__wrapper_locked');
    }
  }

  // Рендеринг модального окна
  render(data?: IModalData): HTMLElement {
    if (data?.content) {
      this.content = data.content;
    }
    this._container.classList.add('modal_active');
    return this._container;
  }
}