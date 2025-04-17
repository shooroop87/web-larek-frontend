/**
 * Абстрактный базовый класс для компонентов отображения
 * @template T Тип данных для рендеринга
 */
export abstract class Component<T> {
    // Корневой DOM-элемент компонента
    protected readonly container: HTMLElement;
  
    /**
     * Конструктор базового компонента
     * @param container Корневой элемент компонента
     */
    constructor(container: HTMLElement) {
      this.container = container;
    }
  
    /**
     * Переключение класса на элементе
     * @param element Элемент для изменения класса
     * @param className Имя класса
     * @param force Принудительное добавление/удаление класса
     */
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
      element.classList.toggle(className, force);
    }
  
    /**
     * Установка текстового содержимого элемента
     * @param element Целевой элемент
     * @param value Устанавливаемое значение
     */
    setText(element: HTMLElement, value: unknown): void {
      element.textContent = String(value);
    }
  
    /**
     * Блокировка/разблокировка элемента
     * @param element Элемент для блокировки
     * @param state Состояние блокировки
     */
    setDisabled(element: HTMLElement, state: boolean): void {
      if (state) {
        element.setAttribute('disabled', 'disabled');
      } else {
        element.removeAttribute('disabled');
      }
    }
  
    /**
     * Скрытие элемента
     * @param element Элемент для скрытия
     */
    setHidden(element: HTMLElement): void {
      element.style.display = 'none';
    }
  
    /**
     * Отображение элемента
     * @param element Элемент для отображения
     */
    setVisible(element: HTMLElement): void {
      element.style.display = '';
    }
  
    /**
     * Установка изображения
     * @param element Элемент изображения
     * @param src Путь к изображению
     * @param alt Альтернативный текст
     */
    setImage(element: HTMLImageElement, src: string, alt?: string): void {
      element.src = src;
      if (alt) element.alt = alt;
    }
  
    /**
     * Добавление обработчика события
     * @param element Элемент для добавления события
     * @param event Название события
     * @param handler Обработчик события
     */
    protected on(element: HTMLElement, event: string, handler: EventListener): void {
      element.addEventListener(event, handler);
    }
  
    /**
     * Удаление всех дочерних элементов
     * @param element Родительский элемент
     */
    protected clear(element: HTMLElement): void {
      element.innerHTML = '';
    }
  
    /**
     * Метод рендеринга компонента
     * @param data Данные для рендеринга
     * @returns Корневой элемент компонента
     */
    abstract render(data?: Partial<T>): HTMLElement;
  }