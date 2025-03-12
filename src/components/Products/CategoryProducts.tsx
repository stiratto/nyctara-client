import { Product } from "@/interfaces/Product.Interface";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import api from "@/api/categories/categories.api";
import { useIsFetching, useQueries } from "@tanstack/react-query";
import ProductsNotFound from "../NotFound/ProductsNotFound";
import { TypographyH1 } from "../Typography/h1";
import { LoaderCircle } from "lucide-react";
import { Filtering } from "./Filtering/Filtering";
import { cn } from "@/utils/utils";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const CategoryProducts = () => {
  const { id: categoryId } = useParams();

  const [categoryProductsResults, categoryResults] = useQueries({
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
      }
    ]
  });

  const { isLoading, data: products } = categoryProductsResults;
  const { data: category } = categoryResults;

  const isFetching = useIsFetching({ queryKey: ['filtered-products'] })


  return (
    <div
      className={cn("flex flex-col justify-center items-center py-32 w-full space-y-8",
        isLoading && "h-screen", products?.length > 3 ? "h-auto" : "h-screen"
      )}
    >
      <div className={cn("fixed text-white transition-all bg-black/50 w-full h-screen top-0 z-[80] flex flex-col items-center justify-center", isFetching === 1 ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <img
          src="https://nyctara-perfumery-static.s3.amazonaws.com/ng+footer+transaprente.png"
          alt="Imagen de carga de filtrado"
          className="animate-wiggle"
        />

        <p>Filtrando productos...</p>
      </div>



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
                <LazyLoadComponent key={product.id}>
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                </LazyLoadComponent>
              ))}
            </div>
          )
          : <ProductsNotFound />}
    </div >
  );
};

export default CategoryProducts;
