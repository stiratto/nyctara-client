import { Dot } from "lucide-react"
import { TypographyP } from "../Typography/p"
import { cn } from "@/utils/utils"

export const IsAvailableBadge = ({ isAvailable, className }: { isAvailable: boolean, className?: string }) => {

   return (
      <TypographyP className={cn("flex text-xs items-center border border-gray-500 rounded-full px-2 w-fit", className)}>
         <Dot size={25} className={cn(isAvailable ? "text-green-500 " : "text-red-500")} />
         <span>{isAvailable ? "DISPONIBLE" : "NO DISPONIBLE"}</span>
      </TypographyP>
   )

}
