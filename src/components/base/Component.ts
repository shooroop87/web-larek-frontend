export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}
  
    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
      element.classList.toggle(className, force);
    }
  
    // Сеттер текста
    protected setText(element: HTMLElement, value: string): void {
      element.textContent = String(value);
    }
  
    // Сеттер смены Disabled
    setDisabled(element: HTMLElement, state: boolean): void {
      if (state) element.setAttribute('disabled', 'disabled');
      else element.removeAttribute('disabled');
    }
  
    // Скрыть элемент
    protected setHidden(element: HTMLElement): void {
      element.style.display = 'none';
    }
  
    // Показать элемент
    protected setVisible(element: HTMLElement): void {
      element.style.removeProperty('display');
    }
  
    // Сеттер изображения
    protected setImage(el: HTMLImageElement, src: string, alt?: string): void {
      el.src = src;
      if (alt) {
        el.alt = alt;
      }
    }
  
    // Вернуть DOM элемент
    render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
    }
  }