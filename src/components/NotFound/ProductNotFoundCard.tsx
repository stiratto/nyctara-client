import { Product } from "@/interfaces/Product.Interface";
import { NavLink as Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ExternalLink } from "lucide-react";

export const ProductNotFoundCard = ({
  product_name,
  product_price,
  product_description,
  id,
  product_images,
  product_notes,
}: Product) => {
  return (
    <Link to={`/producto/${id}`} className="flex flex-col w-full text-black hover:underline">
      <div className="flex flex-col break-words xs:flex-row items-center px-8 py-4 gap-8">
        <img src={product_images?.[0] as string} className="w-36 rounded" />
        <div className="flex flex-col text-sm gap-1 ">
          <h1 className="text-lg  text-blue-500 flex items-center gap-2">{product_name}<ExternalLink /></h1>
          <p className="text-gray-500 max-w-xs truncate">{product_description}</p>
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

      <Separator className="border-gray-500" />
    </Link>
  );
};
