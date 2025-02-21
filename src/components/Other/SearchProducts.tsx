import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input"
import { Loader2, SearchIcon } from "lucide-react";
import productsApi from "@/api/products/products.api";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ProductNotFoundCard } from "../NotFound/ProductNotFoundCard";
import { Product } from "@/interfaces/Product.Interface";

export const SearchProduct = () => {
   const [input, setInput] = useState("");
   const [debouncedInput, setDebouncedInput] = useState("");
   const [show, setShow] = useState(false);
   const resultsRef: any = useRef();

   const { isLoading, data: products } = useQuery({
      queryKey: ["search", debouncedInput],
      queryFn: () => productsApi.SearchProducts(debouncedInput),
      enabled: !!debouncedInput,
   });

   useEffect(() => {
      const timeout = setTimeout(() => {
         setDebouncedInput(input);
      }, 400);

      return () => clearTimeout(timeout);
   }, [input]);

   const handleClickOutside = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
         setShow(false);
      }
   };

   const search = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      setShow(true);
   };

   useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
   }, []);


   return (
      <div className="relative w-full space-y-1 max-w-2xl">
         <div className="flex items-center ">
            <Input
               placeholder="Buscar productos"
               onChange={search}
               className="rounded-lg w-full"
            />
            <SearchIcon size={17} className="absolute right-4 top-3" />
         </div>
         <div
            ref={resultsRef}
            className={clsx(
               "w-full max-h-48 overflow-y-scroll overflow-x-hidden absolute top-11 border rounded-lg bg-[#ecefdc] border-gray-500 text-white",
               show ? "block" : "hidden",
            )}
         >
            {isLoading && (
               <div className="p-4">
                  <Loader2 className="animate-spin" />
               </div>
            )
            }

            {!isLoading && products && products.length >= 1 ? (
               products?.map((product: Product) => <ProductNotFoundCard {...product} />)
            )
               :
               <div className="p-4 flex flex-col ">
                  <p className="text-sm text-gray-700">No pudimos encontrar ningun producto con esa palabra</p>
               </div>
            }
         </div>

      </div>
   )
}


