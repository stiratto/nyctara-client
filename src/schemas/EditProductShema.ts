import { z } from "zod";
import { AddProductSchema } from "./AddProductSchema";

export const EditProductSchema = AddProductSchema

export type TEditProductSchema = z.infer<typeof EditProductSchema>
