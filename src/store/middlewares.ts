import { Discount } from "@/interfaces/Discount.interface";
import { discountNotExistsError } from "./discounts/DiscountsSlice";


export function changePriceIfUserUsingDiscount({ getState }: any) {
   return (next: any) => (action: any) => {
      console.log("ejecutandi idelwalrer...")

      if (action.type === "cart/addProductToCart") {
         try {
            const currentDiscountUsing = getState().discounts.current_discount_being_used

            if (!currentDiscountUsing) {
               return next(action)
            }


            let payload = { ...action.payload}; // Crea una copia superficial del payload
            console.log(payload)
            const product = { ...payload }; // Crea una copia del producto

            if (product && product.product_price) {
               product.product_price -= Math.floor((product?.product_price * parseInt(currentDiscountUsing.discount_total)) / 100)
               payload = product; // Asigna la copia modificada del producto
            }

            return next({ ...action, payload });
         } catch (error: any) {
            console.log(error)
         }
         // Pasa el nuevo action con la copia modificada
      }

      return next(action)
   }
}


export const checkIfUserAlreadyUsedDiscount = ({ getState }: any) => {
   return (next: any) => (action: any) => {
      if (action?.type === "discounts/applyDiscount") {
         const discountsUserAlreadyUsed: Discount[] = getState().discounts.discounts_user_already_used

         const currentDiscountUsing = getState().discounts.current_discount_being_used

         if (currentDiscountUsing) {
            return next(discountNotExistsError({ error: "Ya estas usando un descuento!" }))
         }

         console.log(action)
         const userAlreadyUsedThatDiscount = discountsUserAlreadyUsed.find((discount) => discount?.discount_name === action?.payload?.discount_name)

         if (userAlreadyUsedThatDiscount) {
            return next(discountNotExistsError({ error: "Ya utilizaste ese descuento!" }))
         }

         return next({ ...action })
      }
      return next(action)
   }
}


