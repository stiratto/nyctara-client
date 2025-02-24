import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"
import { FilteringAccordionItems } from "@/utils/consts/filtering"
import { useDrawerFilteringContext } from "@/contexts/FilteringDrawerContext"
import productsApi from "@/api/products/products.api"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const FilteringDrawer = () => {
   const { drawerIsOpen, setDrawerIsOpen } = useDrawerFilteringContext()

   const { refetch: getNotes } = useQuery<string[]>({
      queryKey: ['notes'],
      queryFn: () => productsApi.GetAllNotes()
   })

   useEffect(() => {
      getNotes()
   }, [])

   useEffect(() => {
      console.log(drawerIsOpen)
   }, [drawerIsOpen])


   return (
      <Drawer open={drawerIsOpen} onClose={setDrawerIsOpen} direction={"top"}>
         <DrawerTrigger onClick={setDrawerIsOpen}>Filtrar por</DrawerTrigger>
         <DrawerContent className="bg-[#ecefdc] max-w-3xl mx-auto">

            <DrawerHeader>
               <DrawerTitle>
                  Filtrar productos
               </DrawerTitle>
               <Accordion type={"multiple"} >
                  {FilteringAccordionItems.map((item) => (
                     <AccordionItem value={item.value}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>
                           {item.component}
                        </AccordionContent>
                     </AccordionItem>
                  ))}
               </Accordion>

            </DrawerHeader>
         </DrawerContent>
      </Drawer >
   )
}
