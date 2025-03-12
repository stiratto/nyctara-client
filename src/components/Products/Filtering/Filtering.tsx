import { FilteringDrawer } from "./FilteringDrawer"
import { FilteringAccordionItems, FilteringBadgesItems } from "@/utils/consts/filtering"
import { FilteringBadge } from "./FilteringBadge"
import queryClient from "@/main"
import { RefreshCw } from "lucide-react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import categoriesApi from "@/api/categories/categories.api"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { clearFiltering } from "@/store/filtering/FilteringSlice"

export const Filtering = () => {
   const { id } = useParams()
   const dispatch = useDispatch<AppDispatch>()

   const { filters, params } = useSelector((state: RootState) => state.filtering)


   const { refetch } = useQuery({
      queryKey: ['cleared-category-products', id],
      queryFn: async () => {
         const response = await categoriesApi.GetCategoryProducts(id as string)
         return response
      },
      enabled: !!id,

   })

   const clearFilter = async () => {
      dispatch(clearFiltering())

      const response = await refetch()
      const data = response.data
      queryClient.setQueryData(['category-products', id], data)
   }

   return (
      <div className="flex flex-col items-center gap-2 overflow-x justify-center pb-4">
         <h2 className="text-sm text-gray-500">Filtrar productos</h2>

         <ul className="flex items-center gap-2">

            {FilteringAccordionItems.map((i) => (
               <FilteringBadge component={i.component} key={i.title}>
                  <p>{i.title}</p>
               </FilteringBadge>
            ))}
         </ul>
         <button
            className="text-cyan-500 underline hover:cursor-pointer flex items-center gap-1"
            onClick={clearFilter}>
            <RefreshCw size={15} />
            Limpiar todo
         </button>

      </div>
   )
}
