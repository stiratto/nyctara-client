import { Product } from "@/interfaces/Product.Interface";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import api from "@/api/categories/categories.api";
import { useIsFetching, useQueries } from "@tanstack/react-query";
import clsx from "clsx";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { TypographyH1 } from "../Typography/h1";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { FilteringProvider, useFiltering } from "@/contexts/filteringContext";
import { cn } from "@/utils/utils";
import { FilteringBadgesItems } from "@/utils/consts/filtering";
import { FilteringBadge } from "./Filtering/FilteringBadge";
import { FilteringDrawerContextProvider } from "@/contexts/FilteringDrawerContext";
import { FilteringDrawer } from "./Filtering/FilteringDrawer";
import productsApi from "@/api/products/products.api";
import queryClient from "@/main";
import { useEffect } from "react";

const CategoryProducts = () => {
  const { id: categoryId } = useParams();

  const { filters, setFilters, params } = useFiltering()
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

  const { refetch, data: filteredProducts } = filterProductsQuery

  const clearFiltering = () => {
    setFilters("price", "")
    setFilters("notes", "")
    setFilters("availability", "")
    refetch()
  }

  const { isLoading, data: products } = categoryProductsResults;
  const { data: category } = categoryResults;
  const isFetching = useIsFetching({ queryKey: ['filtered-products'] })

  useEffect(() => {
    queryClient.setQueryData(['category-products', categoryId], filteredProducts)
  }, [filteredProducts])

  return (
    <div
      className={clsx("flex flex-col justify-center items-center py-32 w-full space-y-8",
        { "h-screen": isLoading },
        { "h-auto": products?.length > 3 || "h-screen" },
      )}
    >
      <TypographyH1>{category?.category_name}</TypographyH1>
      <div className={cn("fixed text-white transition-all bg-black/50 w-full h-screen top-0 z-[80] flex flex-col items-center justify-center", isFetching ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <img
          src="https://nyctara-perfumery-static.s3.amazonaws.com/ng+footer+transaprente.png"
          alt="Imagen de carga de filtrado"
          className="animate-wiggle"
        />

        <p>Filtrando productos...</p>
      </div>


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
              <div className="flex flex-col items-center gap-2  overflow-x-scroll border-b border-gray-300 justify-center pb-4 w-full">
                <FilteringProvider>

                  <h2 className="text-sm text-gray-500">Filtrar productos</h2>
                  <FilteringDrawerContextProvider>
                    <div className="hidden">

                      <FilteringDrawer />
                    </div>
                    <ul className="flex items-center gap-2">
                      {FilteringBadgesItems.map((i) => (
                        <FilteringBadge>
                          {i.icon}
                          <p>{i.title}</p>
                        </FilteringBadge>
                      ))}
                    </ul>
                    {filters.price}
                    <button className="text-cyan-500 underline hover:cursor-pointer flex items-center gap-1" onClick={clearFiltering}><RefreshCw size={15} /> Limpiar todo</button>
                  </FilteringDrawerContextProvider>


                </FilteringProvider>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
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
