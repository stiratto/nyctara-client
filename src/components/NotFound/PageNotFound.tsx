import { Frown } from "lucide-react"
import { TypographyH1 } from "../Typography/h1"
import { NavLink as Link } from "react-router-dom"
import { TypographyP } from "../Typography/p"
import { SearchProduct } from "../Other/SearchProducts"

const PageNotFound = () => {
   return (
      <main className="h-screen flex flex-col justify-center items-center gap-8">

         <Frown size={60} />
         <TypographyH1>Disculpa! La pagina que estas buscando no se pudo encontrar</TypographyH1>
         <TypographyP>Intenta buscando otros productos o explora otras categorias</TypographyP>
         <SearchProduct />

         <Link to="/" className="p-2 bg-black text-white font-semibold text-sm">Ir al inicio de Nyctara</Link>
      </main>
   )
}

export default PageNotFound
