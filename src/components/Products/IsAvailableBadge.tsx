import { Dot } from "lucide-react"
import { TypographyP } from "../Typography/p"
import { cn } from "@/lib/utils"

export const IsAvailableBadge = ({ isAvailable }: { isAvailable: boolean }) => {

   return (
      <TypographyP className="flex text-xs items-center border border-gray-500 rounded-full px-2"><Dot size={25} className={cn(isAvailable ? "text-green-500 " : "text-red-500")} />{isAvailable ? "DISPONIBLE" : "NO DISPONIBLE"}</TypographyP>
   )

}
