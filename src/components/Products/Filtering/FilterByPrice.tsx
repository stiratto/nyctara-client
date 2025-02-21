import { DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import productsApi from "@/api/products/products.api";
import { useFiltering } from "@/contexts/filteringContext";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import queryClient from "@/main";
import { useParams } from "react-router-dom";

export const FilterByPrice = () => {
   const [priceFiltering, setPriceFiltering] = useState<string>("")
   const [minMax, setMinMax] = useState({
      min: "",
      max: ""
   })
   const { params, setFilters } = useFiltering()
   const id = useParams()

   const handleFiltering = () => {
      if (minMax.min.length !== 0 && minMax.max.length !== 0) {
         console.log("uhhh")
         setFilters("price", `${minMax.min},${minMax.max}`)
         setMinMax({ min: "", max: "" })
         return
      }
      setFilters("price", priceFiltering)
   }

   const { refetch, data } = useQuery({
      queryKey: ["filtered-products"],
      queryFn: () => productsApi.FilterProducts(params)
   })


   useEffect(() => {
      console.log(id.id)
      queryClient.setQueryData(['category-products', id.id], () => data)
      console.log(queryClient.getQueryData(['category-products']))
   }, [data])

   return (
      <Popover >
         <PopoverTrigger className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center  gap-2 hover:cursor-pointer ">
            <DollarSign size={15} />
            <p>Precio</p>
         </PopoverTrigger>
         <PopoverContent className="text-sm space-y-4 flex flex-col items-center justify-center  bg-[#ecefdc] border border-gray-700 text-black">
            <RadioGroup onValueChange={(e) => setPriceFiltering(e)} defaultValue={priceFiltering}>
            <div className="flex items-center gap-2">
               <RadioGroupItem value="20000,50000" />
               <span>De 20k a 50k</span>
            </div>
            <div className="flex items-center gap-2">
               <RadioGroupItem value="50000,100000" />
               <span>De 50k a 100k</span>
            </div>
            <div className="flex items-center gap-2">
               <RadioGroupItem value="100000,500000" />
               <span>De 100k a 500k</span>
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
         <Button onClick={() => {
            handleFiltering()
            refetch()
         }}>Aplicar</Button>
      </PopoverContent>
      </Popover >
   )
}
