import { z } from "zod";

export const BuyFormSchema = z.object({
   receiver_name: z.string({ message: "Campo requerido" }).min(1, { message: "Campo requerido." }),
   customer_name: z.string({ message: "Campo requerido" }).min(1, { message: "Campo requerido." }),
   address: z.string({ message: "Campo requerido" }).min(1, { message: "Campo requerido." }),
})

export type TBuyFormSchema = z.infer<typeof BuyFormSchema>
