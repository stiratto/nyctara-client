import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Product } from "@/interfaces/Product.Interface";
import { NavLink as Link } from "react-router-dom";
import { Badge } from "../ui/badge";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatPrice } from "@/utils/utils";
import { IsAvailableBadge } from "./IsAvailableBadge";

export const ProductCard = ({
  product_name,
  product_price,
  product_category,
  isAvailable,
  //product_tags,
  //product_description,
  //product_quality,
  product_notes,
  product_images,
  id,
}: Product) => {
  return (
    <Link to={`/producto/${id}`} className="flex flex-col p-0! rounded">

      <Card className="group relative bg-transparent border-black/20 max-w-xs h-full">

        <IsAvailableBadge isAvailable={isAvailable} className="absolute bg-[#ecefdc] rounded-none rounded-br rounded-tl" />
        <LazyLoadImage src={product_images?.[0] as string} effect={"black-and-white"} className="h-80 rounded-t" />

        <CardContent className="flex flex-col gap-2 text-center justify-center items-center w-full">

          <p className="font-bold">{product_category?.category_name}</p>
          <CardDescription className="text-black space-y-2 text-[#e5dc4e]">
            <CardTitle className="group-hover:underline">{product_name}</CardTitle>
            <div className="space-x-4">

            </div>
            <p className="font-bold text-black">${formatPrice(product_price)}</p>
            <button className="opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all text-white bg-black/50 rounded-lg p-2 left-28 absolute top-[17rem] mx-auto font-semibold cursor-pointer">Ver producto</button>
          </CardDescription>

        </CardContent>

      </Card>
    </Link>
  );
};
