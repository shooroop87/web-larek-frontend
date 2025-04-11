export type EventName = string | RegExp;
export type EventCallback<T = unknown> = (data: T) => void;

export interface IEventEmitter {
    on<T = unknown>(event: EventName, callback: EventCallback<T>): void;
    off(event: EventName, callback: EventCallback): void;
    emit<T = unknown>(event: string, data?: T): void;
    trigger<T = unknown>(event: string, context?: Partial<T>): (data: T) => void;
}