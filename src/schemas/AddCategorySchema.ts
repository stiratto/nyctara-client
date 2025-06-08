import { z } from "zod"

export const AddCategorySchema = z.object({
  category_name: z.string({ message: "El nombre de la categoria es requerido" }),
}).required()

export type TAddCategorySchema = z.infer<typeof AddCategorySchema>
