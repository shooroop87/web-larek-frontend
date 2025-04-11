// Условный тип имени события
export type EventName = string | RegExp;

// Тип коллбэка подписчика события
export type EventCallback<T = unknown> = (data: T) => void;

// Интерфейс для брокера событий
export interface IEventEmitter {
    on<T = unknown>(event: EventName, callback: EventCallback<T>): void;
    off(event: EventName, callback: EventCallback): void;
    emit<T = unknown>(event: string, data?: T): void;
    trigger<T = unknown>(event: string, context?: Partial<T>): (data: T) => void;
}