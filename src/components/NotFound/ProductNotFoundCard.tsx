import { Product } from "@/interfaces/Product.Interface";
import { NavLink as Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export const ProductNotFoundCard = ({
  product_name,
  product_price,
  product_description,
  id,
  product_images,
  product_notes,
}: Product) => {
  return (
    <Link to={`/producto/${id}`} className="flex flex-col w-full">
      <div className="flex flex-col break-words xs:flex-row items-center px-8 py-4 gap-8 grow ">
        <img src={product_images?.[0] as string} className="w-24 " />
        <div className="flex flex-col text-sm gap-1">
          <h1 className="text-black text-lg">{product_name}</h1>
          <p className="text-gray-700 max-w-xs truncate">{product_description}</p>
          <p className="font-bold text-lg">${product_price}</p>
          <div>
            {product_notes.map((note: string) => (
              <Badge className="bg-gray-200 hover:bg-gray-200 font-semibold text-black">
                {note}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator />
    </Link>
  );
};
