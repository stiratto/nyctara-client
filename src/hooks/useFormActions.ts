import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { deleteItemFromArrayState } from "../utils/utils.ts";
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
      state: "product_notes" | "product_tags"
   ) => {
      console.log(form.getValues(state))
      const newState = deleteItemFromArrayState(form.getValues(state), index)
      form.setValue(state, newState, { shouldValidate: true });
   };


   const handleImageChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
         let [
            product_images,
         ] = form.watch([
            "product_images",
         ]);

         const files = Array.from(e.target.files ?? []);
         form.setValue('product_images', [...(product_images as File[]), ...files], { shouldDirty: true, shouldValidate: true });
      } catch (err) {
         console.log(err);
      }
   };

   return {
      addItemToFormState,
      deleteItemFromFormState,
      handleImageChangeForm
   }
}



