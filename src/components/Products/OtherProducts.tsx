import productsApi from "@/api/products/products.api";
import { Product } from "@/interfaces/Product.Interface.ts";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import ProductsNotFound from "../NotFound/ProductsNotFound.tsx";
import { TypographyH1 } from "../Typography/h1.tsx";
import { ProductCard } from "./ProductCard.tsx";

const OtherProducts = (id: { id: string }) => {
  const { id: productId } = id;

  const {
    isLoading,
    isError,
    data: otherProducts,
  } = useQuery<Product[]>({
    queryKey: ["other-products"],
    queryFn: () => productsApi.GetProductsByLimit(3, productId),
  });

  return (
    <div className="py-24 gap-8 flex flex-col justify-center items-center">
      <TypographyH1>Otros productos</TypographyH1>
      {isLoading && <LoaderCircle />}

      {!isLoading && isError && <ProductsNotFound />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {!isLoading
          && !isError
          && otherProducts?.map((p: Product, index: number) => (
            <ProductCard
              key={index}
              {...p}
            />
          ))}
      </div>
    </div>
  );
};

export default OtherProducts;
