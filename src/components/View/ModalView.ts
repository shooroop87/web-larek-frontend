import { IEvents } from "../base/events";

export interface IModalView {
  open(): void;
  close(): void;
  render(): HTMLElement;
  content: HTMLElement;
  locked: boolean;
}

export class ModalView implements IModalView {
  protected modalContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _pageWrapper: HTMLElement;

  constructor(modalContainer: HTMLElement, protected events: IEvents) {
    this.modalContainer = modalContainer;
    this.closeButton = modalContainer.querySelector('.modal__close');
    this._content = modalContainer.querySelector('.modal__content');
    this._pageWrapper = document.querySelector('.page__wrapper');

    // Закрытие по кнопке
    this.closeButton.addEventListener('click', this.close.bind(this));

    // Закрытие по клику вне модального окна
    this.modalContainer.addEventListener('click', this.close.bind(this));
    this.modalContainer.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());

    // Слушаю событие modal:open
    this.events.on('modal:open', (content: HTMLElement) => {
      this.content = content;
      this.render();
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.modalContainer.classList.add('modal_active');
  }

  close() {
    const activeModal = document.querySelector('.modal.modal_active') as HTMLElement;
    if (activeModal) {
      activeModal.classList.remove('modal_active');
      this.events.emit('modal:close');
    }
  }

  set locked(value: boolean) {
    if (value) {
      this._pageWrapper.classList.add('page__wrapper_locked');
    } else {
      this._pageWrapper.classList.remove('page__wrapper_locked');
    }
  }

  render(): HTMLElement {
    this.open();
    return this.modalContainer;
  }
}
