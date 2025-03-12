import productsApi from "@/api/products/products.api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useFiltering } from "@/contexts/FilteringContext"
import queryClient from "@/main"
import { addNewFiltering } from "@/store/filtering/FilteringSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

export const FilterByNotes = () => {
   const { id } = useParams()
   const [selectedNotes, setSelectedNotes] = useState<string[]>([])
   const { data: notes } = useQuery<string[]>({
      queryKey: ['notes'],
      queryFn: () => productsApi.GetAllNotes()
   })

   const dispatch = useDispatch<AppDispatch>()
   const { params, filters } = useSelector((state: RootState) => state.filtering)

   const handleFiltering = () => {
      dispatch(addNewFiltering({ by: "notes", param: selectedNotes }))
   }

   useQuery({
      queryKey: ["filtered-products", params],
      queryFn: async () => {
         const response = await productsApi.FilterProducts(params, id as string)
         queryClient.setQueryData(['category-products', id], response)

         return response
      },
      enabled: !!filters.notes
   })


   return (
      <div className="flex flex-col gap-4">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {notes?.map((note, i) => (
               <div className="flex items-center gap-2">

                  <Checkbox id={note} onCheckedChange={(e) =>
                     e ? setSelectedNotes([...selectedNotes, note])
                        : setSelectedNotes(selectedNotes.filter((_, ind) => ind !== i))

                  } />
                  <label htmlFor={note}>{note}</label>

               </div>
            ))}

         </div>
         <Button
            className="w-min rounded-full bg-black hover:bg-black/50"
            //disabled={selectedNotes.length < 1}
            onClick={handleFiltering}
         >Aplicar</Button>

      </div>
   )
}
