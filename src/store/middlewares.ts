import { Discount } from "@/interfaces/Discount.interface";
import { discountNotExistsError } from "./discounts/DiscountsSlice";
import { changeProductPrice } from "./cart/CartProductsSlice";
import { Product } from "@/interfaces/Product.Interface";


export function changePriceIfUserUsingDiscount({ getState }: any) {
   return (next: any) => (action: any) => {
      if (action.type === "cart/updateCartProducts") {
         console.log(action)
         const currentDiscountUsing = getState().discounts.current_discount_being_used

         if (!currentDiscountUsing) {
            return next(action)
         }

         let payload = { ...action.payload }
         let products = payload.products

         if (products && Array.isArray(products)) {
            console.log("ta chegando?")
            const updatedProductsPrices = products?.map((product) => {
               return { 
                  ...product,
                  product_price: product.product_price - Math.floor((product?.product_price * parseInt(currentDiscountUsing.discount_total)) / 100)
               }
            })
            payload = { products: updatedProductsPrices, currentDiscountUsing }
         }

         return next({ ...action, payload })
      }
      if (action.type === "cart/addProductToCart") {
         try {
            console.log("change price if user using iscount")
            const currentDiscountUsing = getState().discounts.current_discount_being_used

            if (!currentDiscountUsing) {
               return next(action)
            }

            let payload = { ...action.payload }; // Crea una copia superficial del payload
            const product = { ...payload?.product }; // Crea una copia del producto

            if (product && product.product_price) {
               product.product_price -= Math.floor((product?.product_price * parseInt(currentDiscountUsing.discount_total)) / 100)
               payload = {
                  product,
                  discountUserUsing: currentDiscountUsing
               }; // Asigna la copia modificada del producto
            }

            return next({ ...action, payload });
         } catch (error: any) {
            console.log(error)
         }
      }
      return next(action)
   }
}


//checks if the user already used the discount that he is trying to
//apply or if he already is using one discount
export const checkIfUserAlreadyUsedDiscount = ({ getState }: any) => {
   return (next: any) => (action: any) => {
      if (action?.type === "discounts/applyDiscount") {
         const discountsUserAlreadyUsed: Discount[] = getState().discounts.discounts_user_already_used

         const currentDiscountUsing = getState().discounts.current_discount_being_used

         if (currentDiscountUsing) {
            return next(discountNotExistsError({ error: "Ya estas usando un descuento!" }))
         }

         const userAlreadyUsedThatDiscount = discountsUserAlreadyUsed.find((discount) => discount?.discount_name === action?.payload?.discount_name)

         if (userAlreadyUsedThatDiscount) {
            return next(discountNotExistsError({ error: "Ya utilizaste ese descuento!" }))
         }

         return next({ ...action })
      }
      return next(action)
   }
}


// change price of all products (if there is) in cart when user
// applies discount
export const changePriceApplyDiscount = () => {
   return (next: any) => (action: any) => {
      if (action?.type === "discounts/applyDiscount") {
         const discountToApply = action.payload
         console.log(discountToApply)


         next(changeProductPrice({ discount_total: discountToApply.discount_total }))
      }
      return next(action)
   }
}


