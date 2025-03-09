import { createContext, useContext, useState } from "react";

type FilteringDrawerContextType = {
   drawerIsOpen: boolean,
   setDrawerIsOpen: () => void
} | null

const FilteringDrawerContext = createContext<FilteringDrawerContextType>(null)

export const FilteringDrawerContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false)

   const value = {
      drawerIsOpen,
      setDrawerIsOpen: () => {
         setDrawerIsOpen(prev => !prev)
      }
   }

   return (
      <FilteringDrawerContext.Provider value={value}>
         {children}
      </FilteringDrawerContext.Provider>
   )
}

export const useDrawerFilteringContext = () => {
   let context = useContext(FilteringDrawerContext)

   if (!context) {
      throw new Error("useDrawerFilteringContext() debe ser usado dentro de FilteringDrawerContext.Provider")
   }

   return context
}
