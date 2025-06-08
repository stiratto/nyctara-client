
/*
 * [get preview of images array]
 *
 * @param {[Array<string | file>]} [array of images to get preview]
 * @return {[Array<string>]}
 *
 * */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios"

export const getImagesPreview = (images: (string | File)[]) => {
   return (images || []).map((image) => {
      // If image is type File, we need to generate the url
      if (image instanceof File) {
         return URL.createObjectURL(image)
      }
      // If the image is type string, its already an url
      return image
   })
}

export const getAxiosErrorResponse = (error: any): string => {
   if (axios.isAxiosError(error)) {
      return error.response?.data?.message || "Ocurrio un error inesperado"
   }
   return ""
}
export const formatPrice = (price: number) => {

   if (price) {
      let parts = price?.toString().split(".");

      if (parts) {

         parts[0] = parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
         return parts?.join(",");
      }


   }
}

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}


