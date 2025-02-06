import { z } from "zod"

export const AddCategorySchema = z.object({
  category_name: z.string({ message: "El nombre de la categoria es requerido" }),
  category_image: z.any().refine((files) => files?.length === 1, {
    message: "La imagen de la categoria es requerida",
  })
}).required()

export type TAddCategorySchema = z.infer<typeof AddCategorySchema>
