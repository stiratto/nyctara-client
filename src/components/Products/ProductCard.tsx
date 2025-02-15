import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Product } from "@/interfaces/Product.Interface";
import React, { useEffect } from "react";
import { NavLink as Link } from "react-router-dom";
import { Badge } from "../ui/badge";

import { LazyLoadImage } from "react-lazy-load-image-component";

export const ProductCard = ({
  product_name,
  product_price,
  product_category,
  //product_tags,
  //product_description,
  //product_quality,
  product_notes,
  product_images,
  id,
}: Product) => {
  const [formattedPrice, setFormattedPrice] = React.useState("");

  useEffect(() => {
    const formattedPrice = product_price.toLocaleString("es-ES", {
      style: "currency",
      currency: "COP",
    });
    const result = formattedPrice.replace("COP", "").replace(",00", "").trim();
    setFormattedPrice(result);
  }, [product_price]);


  return (
    <Link to={`/producto/${id}`} className="flex flex-col p-0! rounded">
      <Card className="group relative  bg-transparent border-black/20">

        <LazyLoadImage src={product_images?.[0] as string} effect={"black-and-white"} className="w-64 h-80 object-fill rounded-t" />
        <CardContent className=" flex flex-col">
          <p className="font-bold">{product_category?.category_name}</p>
          <CardDescription className="text-black space-y-2">
            <CardTitle className="group-hover:underline">{product_name}</CardTitle>
            <div className="space-x-4">
              {product_notes.map((n) => (
                <Badge className="bg-[#D3DAAE] text-black">{n}</Badge>
              ))}
            </div>
            <p className="font-bold">${formattedPrice}</p>
            <button className="opacity-0 group-hover:opacity-100 hover:bg-white/30 transition-all text-white bg-black/50 rounded-lg p-2 left-18 absolute top-[17rem] mx-auto font-semibold">Ver producto</button>
          </CardDescription>

        </CardContent>

      </Card>
    </Link>
  );
};
