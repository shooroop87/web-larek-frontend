/**
 * Интерфейс для объекта с уникальным идентификатором
 */
export interface IIdentifiable {
    id: string;
  }
  
  /**
   * Тип для объектов с частичными свойствами
   */
  export type TPartial<T> = Partial<T>;
  
  /**
   * Тип для пары ключ-значение
   */
  export type TKeyValue = Record<string, string | number | boolean>;
  
  /**
   * Интерфейс для классов, создающих элементы по шаблону
   */
  export interface ICreatable<T> {
    create(data?: T): HTMLElement;
  }
  
  /**
   * Интерфейс для классов с шаблонизацией
   */
  export interface ITemplatable<T> {
    template: HTMLTemplateElement;
    render(data: T): HTMLElement;
  }
  
  /**
   * Тип функции-обработчика события
   */
  export type EventHandler<T> = (event: T) => void;
  
  /**
   * Интерфейс брокера событий
   */
  export interface IEventEmitter<T> {
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
    off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
    emit<K extends keyof T>(event: K, data: T[K]): void;
  }