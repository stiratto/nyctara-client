import { Product } from "@/interfaces/Product.Interface";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";

import api from "@/api/categories/categories.api";
import { useIsFetching, useQueries } from "@tanstack/react-query";
import clsx from "clsx";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { TypographyH1 } from "../Typography/h1";
import { CircleHelp, Clock9, DollarSign, Leaf, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { FilteringProvider } from "@/contexts/filteringContext";
import { cn } from "@/utils/utils";
import { FilteringDrawer } from "./Filtering/FilteringDrawer";
import { FilteringDrawerContextProvider, useDrawerFilteringContext } from "@/contexts/FilteringDrawerContext";

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
  const { setDrawerIsOpen } = useDrawerFilteringContext()

  const isFetching = useIsFetching({ queryKey: ['filtered-products'] })

  useEffect(() => {
    console.log(isFetching)
  }, [isFetching])


  return (
    <div
      className={clsx("flex flex-col justify-center items-center py-32 container space-y-8",
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



      <p className="flex items-center gap-2"><SlidersHorizontal size={20} />Ordenar por</p>
      <div className="flex items-center gap-2 max-w-sm overflow-x-scroll">

        <FilteringProvider>
          <FilteringDrawer />
          <div className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center gap-2 hover:cursor-pointer" onClick={setDrawerIsOpen}>
            <DollarSign size={15} />
            <p>Precio</p>
          </div>

          <div className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center gap-2 hover:cursor-pointer" onClick={setDrawerIsOpen}>
            <CircleHelp size={15} />
            <p>Disponibilidad</p>
          </div>
          <div className="p-2 bg-gray-300 text-black rounded-full text-sm flex items-center gap-2 hover:cursor-pointer" onClick={setDrawerIsOpen}>
            <Leaf size={15} />
            <p>Nota</p>
          </div>
        </FilteringProvider>

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
