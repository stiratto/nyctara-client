import { Product } from "@/interfaces/Product.Interface";
import { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";

export function changePriceIfUserUsingDiscount({ getState }: MiddlewareAPI) {
  return (next: Dispatch<any>) => (action: any) => {
    if (action.type === "cart/addProductToCart") {
      let currentDiscountUsing = getState().discounts.current_discount_being_used

      if (!currentDiscountUsing) {
        return next(action)
      }

      const payload = { ...action.payload }; // Crea una copia superficial del payload
      const product: Product = { ...payload.product }; // Crea una copia del producto

      product.product_price -= Math.floor((product.product_price * currentDiscountUsing.discount_total) / 100)
      payload.product = product; // Asigna la copia modificada del producto

      return next({ ...action, payload }); // Pasa el nuevo action con la copia modificada
    }

    return next(action)
  }
}


