import { FilteringProvider, useFiltering } from "@/contexts/filteringContext"
import { FilteringDrawerContextProvider } from "@/contexts/FilteringDrawerContext"
import { FilteringDrawer } from "./FilteringDrawer"
import { FilteringBadgesItems } from "@/utils/consts/filtering"
import { FilteringBadge } from "./FilteringBadge"
import queryClient from "@/main"
import { RefreshCw } from "lucide-react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import categoriesApi from "@/api/categories/categories.api"
import { useEffect } from "react"

export const Filtering = () => {
   const { id } = useParams()
   const { setFilters } = useFiltering()
   const clearFiltering = () => {
      setFilters("price", "")
      setFilters("notes", "")
      setFilters("availability", "")
   }

   const {data} = useQuery({
      queryKey: ['cleared-category-products', id],
      queryFn: async () => {
         const response = await categoriesApi.GetCategoryProducts(id as string)
         console.log(response)
         queryClient.setQueryData(['category-products'], response)
         return response
      },
      enabled: !!id,

   })
   useEffect(() => {
      data
   }, [])

   return (
      <div className="flex flex-col items-center gap-2 overflow-x justify-center pb-4">
         <FilteringProvider>

            <h2 className="text-sm text-gray-500">Filtrar productos</h2>
            <FilteringDrawerContextProvider>

               <div className="hidden">
                  <FilteringDrawer />
               </div>
               <ul className="flex items-center gap-2">
                  {FilteringBadgesItems.map((i) => (
                     <FilteringBadge>
                        {i.icon}
                        <p>{i.title}</p>
                     </FilteringBadge>
                  ))}
               </ul>
               <button className="text-cyan-500 underline hover:cursor-pointer flex items-center gap-1" onClick={clearFiltering}><RefreshCw size={15} /> Limpiar todo</button>
            </FilteringDrawerContextProvider>
         </FilteringProvider>

      </div>
   )
}
