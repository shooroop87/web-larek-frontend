import { IEvents } from "../base/events";
import { ShoppingCartModel } from "../Model/ShoppingCartModel";
import { ProductCollectionModel } from "../Model/ProductCollectionModel";
import { ShoppingCartView } from "../View/ShoppingCartView";
import { ModalView } from "../View/ModalView";
import { IProduct } from "../../types";

export class ShoppingCartPresenter {
  constructor(
    private events: IEvents,
    private cartModel: ShoppingCartModel,
    private catalogModel: ProductCollectionModel,
    private cartView: ShoppingCartView,
    private cartItemTemplate: HTMLTemplateElement,
    private modal: ModalView
  ) {
    // Добавление товара в корзину
    this.events.on("cart:item:add", () => {
      this.cartModel.addProduct(this.catalogModel.selectedProduct);
      this.cartView.renderHeaderCartCounter(this.cartModel.getItemCount());
      this.modal.close();
    });

    // Открытие корзины
    this.events.on("cart:open", () => {
      this.cartView.renderTotal(this.cartModel.getTotal());
      this.cartView.updateCartItems(this.cartModel.products, this.cartItemTemplate);
      this.events.emit("modal:open", this.cartView.render());
    });

    // Удаление товара из корзины
    this.events.on("cart:item:remove", (item: IProduct) => {
      this.cartModel.removeProduct(item);
    });

    // Обновление корзины после изменений
    this.events.on("cart:changed", (products: IProduct[]) => {
      this.cartView.renderHeaderCartCounter(this.cartModel.getItemCount());
      this.cartView.renderTotal(this.cartModel.getTotal());
      this.cartView.updateCartItems(this.cartModel.products, this.cartItemTemplate);
    });
  }
}