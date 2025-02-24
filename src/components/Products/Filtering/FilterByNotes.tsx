import productsApi from "@/api/products/products.api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useFiltering } from "@/contexts/filteringContext"
import queryClient from "@/main"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const FilterByNotes = () => {
   const { id } = useParams()
   const [selectedNotes, setSelectedNotes] = useState<string[]>([])
   const { data: notes } = useQuery<string[]>({
      queryKey: ['notes'],
      queryFn: () => productsApi.GetAllNotes()
   })

   const { params, setFilters } = useFiltering()

   const handleFiltering = () => {
      setFilters("notes", selectedNotes)
      filterProducts()
   }

   const { refetch: filterProducts, data: filteredProducts } = useQuery({
      queryKey: ['filtered-products', params],
      queryFn: () => productsApi.FilterProducts(params),
      enabled: !!params
   })



   useEffect(() => {
      queryClient.setQueryData(['category-products', id], filteredProducts)
   }, [filteredProducts])
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
