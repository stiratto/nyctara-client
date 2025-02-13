import { z } from "zod";
import { AddProductSchema } from "./AddProductSchema";

export const EditProductSchema = AddProductSchema.extend({
   tag: z.string().optional(),
   note: z.string().optional(),
})

export type TEditProductSchema = z.infer<typeof EditProductSchema>
