import { createContext, useContext, useEffect, useState } from "react";
// filtrados disponibles
type ByType = "price" | "availability" | "time" | "notes"
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
   time: "newest" | "oldest"
}

// tipo del estado del createContext()
//
export type FilteringProviderState = {
   params: string,
   filters: FiltersStateType,
   setFilters: (by: ByType, param: ParamType) => void
} | null


const FilteringProviderContext = createContext<FilteringProviderState>(null)

// el usuario seleccionaria un filtro, si le da a "aplicar", se
// ejecutaria setFilters() en el componente, si el filtro es precio,
// por ejemplo, filters seria algo asi:
//
// setFilters(by: "price", param: [20000, 50000])
// para disponibilidad seria:
// setFilters(by: "availability", param: "available")
// para time seria:
// setFilters(by: "time", param: "newest") (newest to oldest) o
// setFilters(by: "time", param: "oldest") (oldest to newest) 
// para ontes seria:
// setFilters(by: "notes", param: ["vainilla", "pene"])
// y al armar el url, dividiriamos el array con comillas

export const FilteringProvider = ({ children }: FilteringProviderProps) => {
   const [filters, setFilters] = useState<FiltersStateType>({} as any)
   const [params, setParams] = useState<string>("")

   useEffect(() => {
      // loop through filters entries
      const urlParams = new URLSearchParams()
      for (let [k, v] of Object.entries(filters)) {

         // if the value is an array, join the elements in a single
         // str separated by comma
         if (Array.isArray(v)) {
            v = v.join(",")
         }
         urlParams.append(k, v)
      }

      setParams(urlParams.toString())
      console.log("params at context:", urlParams.toString())

   }, [filters])

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












