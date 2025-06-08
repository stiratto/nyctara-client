import { cn } from "@/utils/utils"

export const FilteringLoadingScreen = ({ isFetching }: { isFetching: boolean }) => {
   return (
      <div className={cn("fixed text-white transition-all bg-black/50 w-full h-screen top-0 z-[80] flex flex-col items-center justify-center", isFetching ? "opacity-100" : "opacity-0 pointer-events-none")}>
         <img
            src="https://nyctara-perfumery-static.s3.amazonaws.com/ng+footer+transaprente.png"
            alt="Imagen de carga de filtrado"
            className="animate-wiggle"
         />

         <p>Filtrando productos...</p>
      </div>
   )
}
