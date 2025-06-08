import { z } from "zod"

export const AddDiscountSchema = z.object({
   discount_name: z.string({ message: "El nombre del descuento es requerido" }),
   discount_total: z.coerce.number({ message: "El total del descuento es requerido" }).min(1, { message: "El porcentaje debe ser mayor que 1 y menor que 100" }).max(100, { message: "El porcentaje debe ser mayor que 1 y menor que 100" }),
   valid_until: z.date({ message: "La fecha es requerida" })
})

export type TAddDiscountSchema = z.infer<typeof AddDiscountSchema>
