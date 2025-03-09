import { cn } from "@/utils/utils";
import { useState } from "react";

export function ImageMagnifier(img: any) {
  // magnifier idea
  // podemos poner la posicion del img zoomeada en el medio delcursor
  const [[x, y], setSize] = useState([0, 0])
  const [isMagnifying, setIsMagnifying] = useState(false)

  const getCursorPosition = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // e.clientX = position of the cursor inside the image
    // rect.left = position of the image
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    // convert the properties to percentages
    const percentX = (offsetX / rect.width) * 100
    const percentY = (offsetY / rect.height) * 100
    setSize([percentX, percentY])
  }

  return (

    <div className="relative">
      <div className={cn("bg-white/50 w-full h-full absolute pointer-events-none hidden", isMagnifying && "block")}></div>
      <img src={img.src} className={cn("h-96 w-[500px] h-[500px] object-content")} alt={"imagen del producto"}
        onMouseMove={(e) => {
          setIsMagnifying(true)
          getCursorPosition(e)
        }}
        onMouseLeave={() => {
          setIsMagnifying(false)
        }}
      />
      <div className={`absolute w-[200px] h-[200px] pointer-events-none transition-opacity duration-100 shadow z-50`} style={{
        top: `${y}%`,
        left: `${x}%`,
        transform: "translate(-50%, -50%)",
        backgroundImage: `url(${img.src})`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundSize: '800%',
        opacity: isMagnifying ? 1 : 0
      }}
      >

      </div>

    </div>
  );
}
