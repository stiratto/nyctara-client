import discountsApi from "@/api/discounts/discounts.api"
import { Discount } from "@/interfaces/Discount.interface"
import { useQuery } from "@tanstack/react-query"

export const AvailableCoupon = () => {
   const { data: discounts } = useQuery<Discount[]>({
      queryKey: ["discounts"],
      queryFn: () => discountsApi.GetDiscounts()
   })

   const lastDiscount = discounts?.at(-1)
   const validUntilDate = new Date(lastDiscount?.valid_until as Date)
   return <>
      {discounts && discounts.length > 0 && (
         <div className="fixed top-16 bg-black text-white w-full z-50 p-2">
            <p className="text-center text-sm truncate ">
               🎉 Utiliza el codigo
               <span className="bg-gray-700 p-1">{lastDiscount?.discount_name}</span>
               y obten un {lastDiscount?.discount_total}% de descuento en todos los productos, valido hasta el {validUntilDate?.toLocaleDateString()}</p>
         </div>
      )}

   </>
}
