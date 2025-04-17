import { IOrder, IProduct } from './models';
import { IOrderResult } from './api';

/**
 * События приложения
 */
export interface IEvents {
  // События каталога
  'catalog:loaded': IProduct[];
  
  // События товара
  'card:select': IProduct;
  'card:add': string;
  'card:remove': string;
  
  // События корзины
  'basket:open': void;
  'basket:changed': { count: number; total: number };
  
  // События заказа
  'order:address': Pick<IOrder, 'address' | 'payment'>;
  'order:contacts': Pick<IOrder, 'email' | 'phone'>;
  'order:submit': IOrder;
  'order:success': IOrderResult;
}