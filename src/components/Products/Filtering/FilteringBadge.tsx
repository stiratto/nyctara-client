import { useDrawerFilteringContext } from "@/contexts/FilteringDrawerContext"

export const FilteringBadge = ({ children }: { children: React.ReactNode }) => {
   const { setDrawerIsOpen } = useDrawerFilteringContext()

   return (
      <li className="p-2 bg-gray-200 border border-gray-500 text-black rounded-full text-xs flex items-center gap-2 hover:cursor-pointer" onClick={setDrawerIsOpen}>
         {children}
      </li>
   )
}
