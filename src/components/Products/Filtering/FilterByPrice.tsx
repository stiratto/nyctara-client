import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { useFiltering } from "@/contexts/filteringContext";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import queryClient from "@/main";
import { useParams } from "react-router-dom";

export const FilterByPrice = () => {
   const { id } = useParams()
   const [priceFiltering, setPriceFiltering] = useState<string>("")
   const [minMax, setMinMax] = useState({
      min: "",
      max: ""
   })
   const { params, filters, setFilters } = useFiltering()

   const handleFiltering = () => {
      if (minMax.min.length !== 0 && minMax.max.length !== 0) {
         setFilters("price", `${minMax.min},${minMax.max}`)
         setMinMax({ min: "", max: "" })
         setPriceFiltering("")
         return
      }

      setFilters("price", priceFiltering)
      setPriceFiltering("")
   }


   const { refetch, data } = useQuery({
      queryKey: ["filtered-products", params],
      queryFn: () => productsApi.FilterProducts(params),
      enabled: !!params
   })


   useEffect(() => {
      queryClient.setQueryData(['category-products', id], data)
   }, [data])


   return (
      <div>

         <div className="text-sm space-y-4 flex flex-col bg-[#ecefdc] text-black">
            <RadioGroup dir="ltr" onValueChange={(e) => {
               setFilters("price", e)
               setPriceFiltering(e)
               refetch()
            }} defaultValue={priceFiltering}>
               <div className="flex items-center gap-2">
                  <RadioGroupItem value="20000,50000" />
                  <span>De $20.000 a $50.000</span>
               </div>
               <div className="flex items-center gap-2">
                  <RadioGroupItem value="50000,100000" />
                  <span>De $50.000 a $100.000</span>
               </div>
               <div className="flex items-center gap-2">
                  <RadioGroupItem value="100000,500000" />
                  <span>De $100.000 a $500.000</span>
               </div>

            </RadioGroup>
            <div className="flex items-center gap-2">
               <Input placeholder="Minimo" onChange={(e) => {
                  setMinMax((prev) => ({ ...prev, min: e.target.value }))
               }} />
               <Input placeholder="Maximo" onChange={(e) => {
                  setMinMax((prev) => ({ ...prev, max: e.target.value }))

               }} />
            </div>
            <Button className="w-min rounded-full mx-auto bg-black hover:bg-black/50" disabled={minMax.min.length < 1 && minMax.max.length < 1} onClick={handleFiltering}>Aplicar</Button>

         </div>
      </div>
   )
}
