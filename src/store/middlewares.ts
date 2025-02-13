import { Discount } from "@/interfaces/Discount.interface";
import { Product } from "@/interfaces/Product.Interface";
import { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { discountNotExistsError } from "./discounts/DiscountsSlice";

export function changePriceIfUserUsingDiscount({ getState }) {
   return (next) => (action) => {
      if (action.type === "cart/addProductToCart") {
         const currentDiscountUsing = getState().discounts.current_discount_being_used

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


export function checkIfUserAlreadyUsedDiscount({ getState }) {
   return (next) => (action) => {
      if (action.type === "discounts/applyDiscount") {
         const discountsUserAlreadyUsed: Discount[] = getState().discounts.discounts_user_already_used

         const currentDiscountUsing = getState().discounts.current_discount_being_used

         if (currentDiscountUsing) {
            return next(discountNotExistsError({ error: "Ya estas usando un descuento!" }))
         }

         const userAlreadyUsedThatDiscount = discountsUserAlreadyUsed.find((d) => d.id === action.payload.discount.id)

         if (userAlreadyUsedThatDiscount) {
            return next(discountNotExistsError({ error: "Ya utilizaste ese descuento!" }))
         }

         return next({ ...action })
      }
      return next(action)
   }
}


