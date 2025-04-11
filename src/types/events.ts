// Перечисление событий View слоя
export enum ViewEvents {
    ProductClick = 'product:click',
    ModalClose = 'modal:close',
    CartRemove = 'cart:remove',
    OrderNext = 'order:next',
}
  
// Перечисление событий Model слоя
export enum ModelEvents {
    ProductAdd = 'product:add',
    OrderStart = 'order:start',
    OrderSubmit = 'order:submit',
}