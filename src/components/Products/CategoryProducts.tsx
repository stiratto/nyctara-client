import { Product } from "@/interfaces/Product.Interface";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";

import api from "@/api/categories/categories.api";
import { useQueries } from "@tanstack/react-query";
import clsx from "clsx";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { TypographyH1 } from "../Typography/h1";
import { CircleHelp, Clock9, Leaf, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { useRef } from "react";
import { FilterByPrice } from "./Filtering/FilterByPrice";
import { FilteringProvider, useFiltering } from "@/contexts/filteringContext";

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
            <div className="space-y-4">

              <p className="flex items-center gap-2"><SlidersHorizontal size={20} />Ordenar por</p>
              <div className="flex items-center gap-2 max-w-sm overflow-x-scroll">

                <FilteringProvider>
                  <FilterByPrice />
                  <div className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center gap-2 hover:cursor-pointer">
                    <CircleHelp size={15} />
                    <p>Disponibilidad</p>
                  </div>
                  <div className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center gap-2 hover:cursor-pointer">
                    <Leaf size={15} />
                    <p>Nota</p>
                  </div>
                  <div className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center gap-2 hover:cursor-pointer">
                    <Clock9 size={15} />
                    <p>Reciente</p>
                  </div>
                </FilteringProvider>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))}

              </div>

            </div>
          )
          : <ProductsNotFound />}
    </div>
  );
};

export default CategoryProducts;
