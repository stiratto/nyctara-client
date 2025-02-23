import productsApi from "@/api/products/products.api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFiltering } from "@/contexts/filteringContext";
import queryClient from "@/main";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const FilterByAvailability = () => {
   const [selectedItem, setSelectedItem] = useState<string>("")
   const { id } = useParams()
   const { params, setFilters } = useFiltering()

   const { refetch: filterProducts, data: filteredProducts } = useQuery({
      queryKey: ['filtered-products', params],
      queryFn: () => productsApi.FilterProducts(params),
      enabled: !!params
   })

   useEffect(() => {
      queryClient.setQueryData(['category-products', id], filteredProducts)
   }, [filteredProducts])

   return (
      <RadioGroup dir="ltr" onValueChange={(e) => {
         setSelectedItem(e)
         setFilters("availability", e === "available" ? "true" : "false")
         filterProducts()
      }} defaultValue={selectedItem}>
         <div className="flex items-center gap-2">
            <RadioGroupItem value="available" />
            <span>Disponible</span>
         </div>
         <div className="flex items-center gap-2">
            <RadioGroupItem value="unavailable" />
            <span>No disponible</span>
         </div>
      </RadioGroup>
   )
}
