import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/interfaces/Product.Interface";
import { addToCart } from "@/utils/utils";
import React, { useEffect } from "react";
import { NavLink as Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import { ShoppingCart } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Discount } from "@/interfaces/Discount.interface";

export const ProductCard = ({
  product_name,
  product_price,
  product_category,
  product_tags,
  product_description,
  product_quality,
  product_notes,
  product_images,
  id,
}: Product) => {
  const [formattedPrice, setFormattedPrice] = React.useState("");

  const discountUserUsing = useSelector((state: RootState) => state.discounts.current_discount_being_used) as Discount

  useEffect(() => {
    const formattedPrice = product_price.toLocaleString("es-ES", {
      style: "currency",
      currency: "COP",
    });
    const result = formattedPrice.replace("COP", "").replace(",00", "").trim();
    setFormattedPrice(result);
  }, [product_price]);

  return (
    <Link to={`/producto/${id}`} className="flex flex-col !p-0 rounded">
      <div className="group relative flex flex-col">
        <LazyLoadImage src={product_images?.[0] as string} effect={"black-and-white"} className="w-64 h-80 object-fill rounded-lg" />
        <button className="opacity-0 group-hover:opacity-100 hover:bg-black/30 transition-all text-white bg-black/50 rounded-lg p-2 absolute top-[17rem] w-[15rem] ml-2 font-semibold">Ver producto</button>
        <span className="font-bold">{product_category?.category_name}</span>
        <h1 className="group-hover:underline">{product_name}</h1>
        <div className="space-x-4">
          {product_notes.map((n) => (
            <Badge className="bg-[#D3DAAE] text-black">{n}</Badge>
          ))}
        </div>
        <p className="font-bold">${formattedPrice}</p>
      </div>
    </Link>
  );
};
