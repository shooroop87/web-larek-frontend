import { IEvents } from "../base/events";
import { ShoppingCartModel } from "../Model/ShoppingCartModel";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";

export class ShoppingCartPresenter {
  constructor(
    private events: IEvents,
    private cartModel: ShoppingCartModel,
    private catalogModel: ProductCollectionModel
  ) {
    // Добавление товара в корзину
    this.events.on('cart:item:add', () => {
      this.cartModel.addProduct(this.catalogModel.selectedProduct);
      this.events.emit('cart:counter:update', this.cartModel.getItemCount());
      this.events.emit('dialog:close');
    });

    // Удаление товара из корзины
    this.events.on('cart:item:remove', (item) => {
      this.cartModel.removeProduct(item);
      this.events.emit('cart:counter:update', this.cartModel.getItemCount());
      this.events.emit('cart:total:update', this.cartModel.getTotal());
    });

    // Открытие корзины
    this.events.on('cart:open', () => {
      this.events.emit('cart:render', {
        items: this.cartModel.products,
        total: this.cartModel.getTotal()
      });
    });
  }
}