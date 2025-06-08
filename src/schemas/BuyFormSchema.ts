import { z } from "zod";

export const BuyFormSchema = z.object({
   receiver_name: z.string({ message: "Campo requerido" }).min(1, { message: "Campo requerido." }),
   customer_name: z.string({ message: "Campo requerido" }).min(1, { message: "Campo requerido." }),
   address: z.string({ message: "Campo requerido" }).min(1, { message: "Campo requerido." }),
   phone_number: z.string({ message: "Campo requerido" }).regex(/3[0-9]{9}/gm, { message: "El numero de telefono no es valido." }).min(1, {message: "Campo requerido"})
})

export type TBuyFormSchema = z.infer<typeof BuyFormSchema>
