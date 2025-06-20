import { AlertTriangle, X } from 'lucide-react';
import { useRef } from 'react';

export const TestPage = () => {
   const ref = useRef<HTMLDivElement>(null)
   const handleClick = () => {
      ref.current?.classList.toggle("warning-floating-active")
   }
   return (
      <div ref={ref} className="warning-floating bg-black text-white p-4 fixed bottom-1 left-1 rounded-xl z-50 max-w-sm flex flex-col items-start justify-center gap-4 transition-all ">

         <div className="flex justify-between items-center w-full">
            <AlertTriangle size={14} />

            <button onClick={handleClick} className="cursor-pointer self-end">
               <X size={14} />

            </button>
         </div>
         <div className="flex gap-2">

            <p className="text-[clamp(2px,5vw,13px)]">Esto es una pagina de test, el servidor puede estar apagado, si ese es el caso, espera un poco antes de proceder a usarla para que se encienda.</p>
         </div>
      </div>
   )
}

