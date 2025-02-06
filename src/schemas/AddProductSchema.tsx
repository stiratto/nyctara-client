import { ProductQuality } from "@/interfaces/Product.Interface";
import { z } from "zod";

export const AddProductSchema = z.object({
  product_name: z.string({ message: "El nombre del producto es requerido" }).min(1, { message: "El nombre del producto es requerido" }),
  product_price: z.coerce.number({ message: "El precio del producto es requerido" }).min(1, { message: "El precio del producto es requerido" }),
  product_description: z.string({ message: "La descripcion del producto es requerida" }).min(10, { message: "La descripcion debe tener por lo menos 10 letras" }),
  product_quality: z.nativeEnum(ProductQuality, { message: "La calidad del producto es requerida" }),
  //product_images: z.any().refine(data => console.log(data)),
  product_images: z.array(z.union([z.instanceof(File), z.string()])).min(1, { message: "Debes seleccionar por lo menos una imagen" }),
  product_category: z.string({ message: "La categoria del producto es requerida" }),
  product_tags: z.array(z.string(), { message: "Las notas del producto son requeridas" }).min(1, { message: "Debes agregar por lo menos 1 etiqueta" }),
  product_notes: z.array(z.string(), { message: "Las notas del producto son requeridas" }).min(1, { message: "Debes agregar por lo menos 1 nota" })
}).required()

export type TAddProductSchema = z.infer<typeof AddProductSchema>
