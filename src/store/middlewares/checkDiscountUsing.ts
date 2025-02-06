import { PRODUCT_PRICE_APPLICABLE_DISCOUNT } from "@/lib/consts/general"

export function checkDiscountUsing({ getState }) {
  return (next) => (action) => {
    if (action.type === "cart/addProductToCart") {
      let currentDiscountUsing = getState().discounts.current_discount_being_used

      if (!currentDiscountUsing) {
        return next(action)
      }

      const payload = { ...action.payload }; // Crea una copia superficial del payload
      const product = { ...payload.product }; // Crea una copia del producto

      if (product.price >= PRODUCT_PRICE_APPLICABLE_DISCOUNT) {
        product.price -= currentDiscountUsing.discount_total
      }



      payload.product = product; // Asigna la copia modificada del producto

      return next({ ...action, payload }); // Pasa el nuevo action con la copia modificada
    }

    return next(action)
  }
}


