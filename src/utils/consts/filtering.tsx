import { FilterByAvailability } from "@/components/Products/Filtering/FilterByAvailability";
import { FilterByNotes } from "@/components/Products/Filtering/FilterByNotes";
import { FilterByPrice } from "@/components/Products/Filtering/FilterByPrice";
import { CircleHelp, DollarSign, Leaf } from "lucide-react";

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
      component: <FilterByNotes />
   },
]

export const FilteringBadgesItems = [
   {
      icon: <DollarSign size={15} />,
      title: "Precio"
   },
   {
      icon: <CircleHelp size={15} />,
      title: "Disponibilidad"
   },
   {
      icon: <Leaf size={15} />,
      title: "Nota"
   }


]
