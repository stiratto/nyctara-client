import productsApi from "@/api/products/products.api";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addNewFiltering } from "@/store/filtering/FilteringSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const FilterByAvailability = () => {
   const queryClient = useQueryClient()
   const [selectedItem, setSelectedItem] = useState<string>("")
   const { id } = useParams()
   const { params, filters } = useSelector((state: RootState) => state.filtering)
   const dispatch = useDispatch<AppDispatch>()

   const handleFiltering = (disponibility: string) => {

      dispatch(addNewFiltering({ by: "availability", param: disponibility === "available" ? "true" : "false" }))
   }

   useQuery({
      queryKey: ['filtered-products', params],
      queryFn: async () => {
         const response = await productsApi.FilterProducts(params, id as string)
         queryClient.setQueryData(['category-products', id], response)
         return response
      },
      enabled: !!filters.availability,
   })



   return (
      <RadioGroup dir="ltr" onValueChange={(e) => {
         setSelectedItem(e)
         handleFiltering(e)
      }} defaultValue={selectedItem}>
         <div className="flex items-center gap-2">
            <RadioGroupItem id="available" value="available" />
            <Label htmlFor="available"  >Disponible</Label>
         </div>
         <div className="flex items-center gap-2">
            <RadioGroupItem id="unavailable" value="unavailable" />
            <Label htmlFor="unavailable" >No disponible</Label>
         </div>
      </RadioGroup>
   )
}
