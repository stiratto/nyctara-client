import { createContext, useContext, useEffect, useState } from "react";
// filtrados disponibles
type ByType = "price" | "availability" | "notes"
// parametros que se les asigna a los filtrados
type ParamType = number[] | string[] | string

// estas son las props que recibe el provider al hacer
// FilteringProviderContext.Provider
type FilteringProviderProps = {
   children: React.ReactNode,
   by?: ByType,
   param?: ParamType

}

export type FiltersStateType = {
   price: string,
   availability: "true" | "false",
   notes: string[],
}

// tipo del estado del createContext()
//
export type FilteringProviderState = {
   params: string,
   filters: FiltersStateType,
   setFilters: (by: ByType, param: ParamType) => void
} | null


//creamos el contexto
const FilteringProviderContext = createContext<FilteringProviderState>(null)

// esto se ejecuta cuando se instancie el Context.Provider, 
export const FilteringProvider = ({ children }: FilteringProviderProps) => {
   // filters guardara un objeto con los filtros permitidos
   const [filters, setFilters] = useState<FiltersStateType>({} as any)
   // los query params que se pasaran al fetch
   const [params, setParams] = useState<string>("")

   // cuando filters cambie
   useEffect(() => {
      // creamos un nuevo urlsearchparams()
      const urlParams = new URLSearchParams()
      // para cada filtro que el usuario selecciono
      for (let [k, v] of Object.entries(filters)) {
         // si el filtro es un array (pueden ser notas)
         if (Array.isArray(v)) {
            // convertimos el array a una string 
            v = v.join(",")
         }
         // anadimos el k,v a urlParams
         urlParams.append(k, v)
      }
      setParams(urlParams.toString())
   }, [filters])

   // esto es lo ques e puede usar en los componentes
   const value = {
      filters,
      setFilters: (by: ByType, param: ParamType) => {
         setFilters((prev) => ({
            ...prev,
            [by]: param
         }))
      },
      params,

   }

   return (

      <FilteringProviderContext.Provider value={value} >
         {children}
      </FilteringProviderContext.Provider>
   )

}

export const useFiltering = () => {
   const context = useContext(FilteringProviderContext)

   if (!context) {
      throw new Error("useFiltering debe ser usado dentro de un FilteringProvider")
   }

   return context
}












