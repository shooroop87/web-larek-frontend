import { AppState } from './AppState';
import { 
  OrderAddressModal, 
  OrderContactsModal, 
  SuccessModal 
} from './Modal';
import { EventEmitter } from './base/events';
import { LarekAPI } from './LarekAPI';
import { IProduct, IOrderData } from '../types';

export class OrderPresenter {
  constructor(
    private model: AppState,
    private addressView: OrderAddressModal,
    private contactsView: OrderContactsModal,
    private successView: SuccessModal,
    private api: LarekAPI,
    private events: EventEmitter
  ) {
    // Подписываемся на события
    this.events.on('order:start', this.openAddressForm.bind(this));
    this.events.on('order:address', this.processAddressStep.bind(this));
    this.events.on('order:contacts', this.processContactsStep.bind(this));
    this.events.on('success:close', this.closeSuccessModal.bind(this));
  }

  // Открытие формы адреса
  private openAddressForm(): void {
    this.addressView.render(this.model.getOrder());
    this.addressView.open();
  }

  // Обработка шага с адресом
  private processAddressStep(data: { address: string, payment: 'card' | 'cash' }): void {
    // Обновляем модель заказа
    this.model.updateOrder(data);
    
    // Закрываем форму адреса и открываем форму контактов
    this.addressView.close();
    this.contactsView.render();
    this.contactsView.open();
  }

  // Обработка шага с контактными данными
  private async processContactsStep(data: { email: string, phone: string }): Promise<void> {
    try {
      // Обновляем модель заказа
      this.model.updateOrder(data);
      
      // Подготавливаем данные для отправки
      const orderData: IOrderData = {
        ...this.model.getOrder(),
        items: this.model.getBasket().map(item => item.id),
        payment: this.model.getOrder().payment || 'card',
        address: this.model.getOrder().address || '',
        email: data.email,
        phone: data.phone
      };
      
      // Отправляем заказ
      const result = await this.api.createOrder(orderData);
      
      // Закрываем форму контактов
      this.contactsView.close();
      
      // Показываем модальное окно успеха
      this.successView.render({
        orderId: result.id,
        total: result.total
      });
      this.successView.open();
      
      // Очищаем корзину
      this.model.clearBasket();
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
    }
  }

  // Закрытие модального окна успеха
  private closeSuccessModal(): void {
    this.successView.close();
  }
}