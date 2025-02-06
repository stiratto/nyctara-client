import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/interfaces/Product.Interface";
import { addToCart } from "@/utils/utils";
import React, { useEffect } from "react";
import { NavLink as Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import { ShoppingCart } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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

  useEffect(() => {
    console.log(product_price)
    const formattedPrice = product_price.toLocaleString("es-ES", {
      style: "currency",
      currency: "COP",
    });
    const result = formattedPrice.replace("COP", "").replace(",00", "").trim();
    setFormattedPrice(result);
  }, [product_price]);

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    try {
      addToCart(
        {
          product_name,
          product_price,
          id,
          product_images,
          product_tags,
          product_notes,
          product_description,
          product_quality,
          product_category,
        },
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Link to={`/producto/${id}`} className="flex flex-col !p-0 rounded">
      <Card className="bg-[#D3DAAE4b]">
        <CardHeader className="p-0">
          <LazyLoadImage alt="Imagen del producto" height={300} effect="black-and-white" src={product_images?.[0] } width={300} className="mx-auto" />
          <CardTitle className="px-6">{product_name}</CardTitle>
          <CardDescription className="px-6">
            {product_category?.category_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-x-2">
            {product_notes
              && product_notes.map((note: string, index: number) => (
                <Badge key={index} className="bg-gray-200 text-black hover:!bg-gray-200">
                  {note}
                </Badge>
              ))}
          </div>
          <div className="space-x-2">
            {product_tags
              && product_tags.map((tag: string, index: number) => (
                <Badge key={index} className="bg-gray-200 text-black hover:!bg-gray-200">
                  {tag}
                </Badge>
              ))}
          </div>
        </CardContent>
        <CardFooter className="justify-between space-y-2 flex-wrap">
          <p className="font-extrabold">${formattedPrice}</p>
          <Button
            className="flex items-center gap-2 !bg-"
            onClick={handleAddToCart}
          >
            <ShoppingCart />
            Anadir al carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
