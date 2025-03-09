import { Product } from "@/interfaces/Product.Interface";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import api from "@/api/categories/categories.api";
import { useIsFetching, useQueries } from "@tanstack/react-query";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { TypographyH1 } from "../Typography/h1";
import { LoaderCircle } from "lucide-react";
import { useFiltering } from "@/contexts/filteringContext";
import productsApi from "@/api/products/products.api";
import queryClient from "@/main";
import { useEffect } from "react";
import { FilteringLoadingScreen } from "./Filtering/FilteringLoadingScreen";
import { Filtering } from "./Filtering/Filtering";
import { cn } from "@/utils/utils";

const CategoryProducts = () => {
  const { id: categoryId } = useParams();

  const { params } = useFiltering()
  const [categoryProductsResults, categoryResults, filterProductsQuery] = useQueries({
    queries: [
      {
        queryKey: ["category-products", categoryId],
        queryFn: () => api.GetCategoryProducts(categoryId as string),
        enabled: !!categoryId,
      },
      {
        queryKey: ["category", categoryId],
        queryFn: () => api.GetCategoryById(categoryId as string),
        enabled: !!categoryId,
      },
      {
        queryKey: ['filtered-products', params],
        queryFn: () => productsApi.FilterProducts(params),
        enabled: !!params
      }

    ],
  });

  const { data: filteredProducts } = filterProductsQuery


  const { isLoading, data: products } = categoryProductsResults;
  const { data: category } = categoryResults;
  const isFetching = useIsFetching({ queryKey: ['filtered-products'] })

  useEffect(() => {
    queryClient.setQueryData(['category-products', categoryId], filteredProducts)
  }, [filteredProducts])

  return (
    <div
      className={cn("flex flex-col justify-center items-center py-32 w-full space-y-8",
        isLoading && "h-screen", products?.length > 3 ? "h-auto" : "h-screen"
      )}
    >

      {isFetching && <FilteringLoadingScreen isFetching />}
      <TypographyH1>{category?.category_name}</TypographyH1>

      <Filtering />

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
    </div >
  );
};

export default CategoryProducts;
