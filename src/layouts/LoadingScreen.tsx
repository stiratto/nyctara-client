import { cn } from "@/utils/utils"

export const LoadingScreen = () => {
   return (
      <div className="h-screen">
         <div className={cn("fixed text-white transition-all bg-black/50 w-full h-screen top-0 z-[80] flex flex-col items-center justify-center")}>
            <img
               src="https://nyctara-perfumery-static.s3.amazonaws.com/ng+footer+transaprente.png"
               alt="Imagen de carga de filtrado"
               className="animate-wiggle"
            />
         </div>
      </div>
   )
}
