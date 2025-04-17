/**
 * Базовый компонент, от которого наследуются все компоненты приложения
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}
  
    /**
     * Переключить класс у элемента
     */
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
      element.classList.toggle(className, force);
    }
  
    /**
     * Установить текстовое содержимое элемента
     */
    setText(element: HTMLElement, text: string): void {
      element.textContent = text;
    }
  
    /**
     * Установить изображение с альтернативным текстом
     */
    setImage(element: HTMLImageElement, src: string, alt?: string): void {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  
    /**
     * Очистить содержимое элемента
     */
    clear(element: HTMLElement): void {
      element.innerHTML = '';
    }
  
    /**
     * Скрыть элемент
     */
    hide(element: HTMLElement): void {
      element.style.display = 'none';
    }
  
    /**
     * Показать элемент
     */
    show(element: HTMLElement, display: string = 'block'): void {
      element.style.display = display;
    }
  
    /**
     * Добавить обработчик события
     */
    on<K extends keyof HTMLElementEventMap>(
      element: HTMLElement,
      eventName: K,
      callback: (event: HTMLElementEventMap[K]) => void
    ): void {
      element.addEventListener(eventName, callback);
    }
  
    /**
     * Удалить обработчик события
     */
    off<K extends keyof HTMLElementEventMap>(
      element: HTMLElement,
      eventName: K,
      callback: (event: HTMLElementEventMap[K]) => void
    ): void {
      element.removeEventListener(eventName, callback);
    }
  
    /**
     * Отрисовать содержимое в элемент
     */
    abstract render(data?: T): HTMLElement;
  }