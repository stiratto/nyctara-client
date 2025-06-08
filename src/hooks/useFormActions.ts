import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { TAddProductSchema } from "@/schemas/AddProductSchema.tsx";
import { TEditProductSchema } from "@/schemas/EditProductShema.ts";

export const useFormActions = (form: UseFormReturn<TAddProductSchema | TEditProductSchema>) => {
   const addItemToFormState = (
      state: "product_notes" | "product_tags",
      field: ControllerRenderProps<any, typeof state>,
   ) => {
      const localState = state === "product_notes" ? form.getValues("note") : form.getValues("tag")
      if (localState?.trim() === "") return;

      console.log(localState)
      const newState = [...field.value, localState] as string[]

      form.setValue(state, newState, {
         shouldValidate: true,
      });
   }

   const deleteItemFromFormState = (
      index: number,
      state: "product_notes" | "product_tags" | "product_images"
   ) => {
      const newState = form.getValues(state).filter((_, i) => i !== index)
      form.setValue(state, newState, { shouldValidate: true });
   };

   const handleImageChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
         let [
            product_images,
         ] = form.watch([
            "product_images",
         ]);

         if (e && e.target.files) {
            const files = Array.from(e.target.files);
            form.setValue(
               'product_images',
               [...(product_images as File[]), ...files],
               { shouldValidate: true }
            );
         }

      } catch (err) {
         console.log(err);
      }
   };

   const removeImageFromForm = (index: number, arrayFormName: any) => {
      try {
         const prevImages = form.getValues(arrayFormName);
         const updatedImages = prevImages.filter((_: any, i: number) => i !== index);
         form.setValue(arrayFormName, updatedImages, { shouldValidate: true });
      } catch (err) {
         console.log(err);
      }
   };

   return {
      addItemToFormState,
      deleteItemFromFormState,
      handleImageChangeForm,
      removeImageFromForm
   }
}



