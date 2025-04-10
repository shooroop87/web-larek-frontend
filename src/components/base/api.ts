// Ответ со списком (обёртка от API)
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

// Методы, допустимые для POST-запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Базовый класс для выполнения запросов к API
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    // Обработка ответа от сервера
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    // GET-запрос
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    // POST/PUT/DELETE-запрос
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}