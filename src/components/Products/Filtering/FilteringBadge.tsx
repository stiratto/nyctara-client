import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"


export const FilteringBadge = ({ children, component }: { children: React.ReactNode, component: any }) => {

   return (
      <Popover>
         <PopoverTrigger className="p-2 bg-gray-200 border border-gray-500 text-black rounded-full text-xs flex items-center gap-2 hover:cursor-pointer">
            {children}
         </PopoverTrigger>
         <PopoverContent className="bg-[#ecefdc]">
            {component}
         </PopoverContent>
      </Popover>
   )
}
