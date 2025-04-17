// Типы данных для проекта Web-Larek

// Товар от API
export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;
    inBasket?: boolean;
  }
  
  // Данные заказа
  export interface IOrderData {
    payment: 'card' | 'cash';
    address: string;
    email: string;
    phone: string;
    items: string[];
  }
  
  // Результат заказа от сервера
  export interface IOrderResult {
    id: string;
    total: number;
  }
  
  // Категории товаров
  export const ProductCategories = {
    SOFT_SKILL: 'софт-скилл',
    HARD_SKILL: 'хард-скилл',
    OTHER: 'другое'
  } as const;
  
  // События приложения
  export enum AppEvents {
    CATALOG_LOADED = 'catalog:loaded',
    PRODUCT_SELECT = 'product:select',
    PRODUCT_ADD = 'product:add',
    PRODUCT_REMOVE = 'product:remove',
    BASKET_CHANGED = 'basket:changed',
    ORDER_START = 'order:start',
    ORDER_ADDRESS = 'order:address',
    ORDER_CONTACTS = 'order:contacts',
    ORDER_SUBMIT = 'order:submit',
    SUCCESS_CLOSE = 'success:close'
  }