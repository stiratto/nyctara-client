import { FilterByAvailability } from "@/components/Products/Filtering/FilterByAvailability";
import { FilterByPrice } from "@/components/Products/Filtering/FilterByPrice";

export const FilteringAccordionItems = [
   {
      value: "item-precio",
      title: "Precio",
      component: <FilterByPrice />
   },
   {
      value: "item-availability",
      title: "Disponibilidad",
      component: <FilterByAvailability />
   },
   {
      value: "item-notes",
      title: "Notas",
      component: <FilterByPrice />
   },
]
