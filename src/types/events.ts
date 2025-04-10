// Алиас имени события
export type EventName = string | RegExp;

// Алиас подписчика
export type EventCallback<T = unknown> = (data: T) => void;

// Алиас события
export type EmitterEvent = {
    eventName: string;
    data: unknown;
};

// Интерфейс API брокера событий (будет для типизации вне base/)
export interface IEventEmitter {
    on<T = unknown>(event: EventName, callback: EventCallback<T>): void;
    off(event: EventName, callback: EventCallback): void;
    emit<T = unknown>(event: string, data?: T): void;
    trigger<T = unknown>(event: string, context?: Partial<T>): (data: T) => void;
}