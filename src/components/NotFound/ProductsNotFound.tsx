import { Frown } from "lucide-react";
import { TypographyH1 } from "../Typography/h1";
import { SearchProduct } from "../Other/SearchProducts";

const ProductsNotFound = () => {
  return (
    <div className="flex gap-8 items-center flex-col justify-center px-4">
      <Frown size={70} />
      <TypographyH1>No se pudieron encontrar productos</TypographyH1>
      <p>
        No pudimos encontrar productos. Prueba buscando otros productos o explora otras categorias
      </p>
      <SearchProduct />
    </div>
  );
};

export default ProductsNotFound;
