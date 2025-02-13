import { Product } from "@/interfaces/Product.Interface";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";

import api from "@/api/categories/categories.api";
import { useQueries } from "@tanstack/react-query";
import clsx from "clsx";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { TypographyH1 } from "../Typography/h1";
import { LoaderCircle } from "lucide-react";

const CategoryProducts = () => {
  const categoryId = useParams().id as string;

  const [categoryProductsResults, categoryResults] = useQueries({
    queries: [
      {
        queryKey: ["category-products", categoryId],
        queryFn: () => api.GetCategoryProducts(categoryId),
        enabled: !!categoryId,
      },
      {
        queryKey: ["category", categoryId],
        queryFn: () => api.GetCategoryById(categoryId),
        enabled: !!categoryId,
      },
    ],
  });

  const { isLoading, data: products } = categoryProductsResults;
  const { data: category } = categoryResults;

  return (
    <div
      className={clsx("flex flex-col justify-center items-center py-32 container space-y-8 size-full",
        { "h-screen": isLoading },
        { "h-auto": products?.length > 3 || "h-screen" },
      )}
    >
      <TypographyH1>{category?.category_name}</TypographyH1>

      {isLoading
        ? (
          <div className="text-center ">
            <h1 className="text-2xl font-bold">
              <LoaderCircle size={70} className="animate-spin duration-600" />
            </h1>
          </div>
        )
        : products.length > 0
          ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
              ))}
            </div>
          )
          : <ProductsNotFound />}
    </div>
  );
};

export default CategoryProducts;
