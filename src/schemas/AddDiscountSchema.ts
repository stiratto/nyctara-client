import { z } from "zod"

export const AddDiscountSchema = z.object({
   discount_name: z.string({ message: "El nombre del descuento es requerido" }),
   discount_total: z.number({ message: "El total del descuento es requerido" }),
   valid_until: z.date({ message: "La fecha es requerida" })
})

export type TAddDiscountSchema = z.infer<typeof AddDiscountSchema>
