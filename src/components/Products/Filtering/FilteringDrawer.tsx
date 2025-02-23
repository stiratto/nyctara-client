import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"
import { FilteringAccordionItems } from "@/utils/consts/filtering-accordion-items"
import { useDrawerFilteringContext } from "@/contexts/FilteringDrawerContext"

export const FilteringDrawer = () => {
   const { drawerIsOpen, setDrawerIsOpen } = useDrawerFilteringContext()

   return (
      <Drawer open={drawerIsOpen} onClose={setDrawerIsOpen}>
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
      </Drawer>
   )
}
